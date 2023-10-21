import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatGptRequestService } from '../chat-gpt-request.service';
import { Chat, FirebaseService, Message, User } from '../firebase.service';
import { BehaviorSubject } from 'rxjs';
import { IonContent } from "@ionic/angular";

type ChatDisplay = Chat & {
  messages: MessageWithInsult[];
};

type MessageWithInsult = Message & { isInsult: boolean };

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})


export class ChatPage {
  public chat: BehaviorSubject<ChatDisplay | undefined> = new BehaviorSubject<ChatDisplay | undefined>(undefined);
  public typingMessage = '';
  private activatedRoute = inject(ActivatedRoute)
  public currentUser: BehaviorSubject<User | undefined>;
  public participantsDisplayname: string[] = [];
  @ViewChild('content')
  container: IonContent | undefined;

  constructor(private firebase: FirebaseService, private ai: ChatGptRequestService) {
    this.currentUser = firebase.currentUser();
    firebase.getChat(this.activatedRoute.snapshot.paramMap.get('id')!).subscribe(async chat => {
      let newChat: ChatDisplay = { ...chat, messages: chat.messages.map<MessageWithInsult>(message => ({ ...message, isInsult: false })) };
      if (this.chat?.value?.messages) {
        newChat = await this.scanMessage(newChat);
        console.error(newChat);
      }
      this.chat.next(newChat);
      setTimeout(() => {
        this.container?.scrollToBottom();
      });
    });
    this.chat.subscribe(chat => {
      this.participantsDisplayname = chat?.users.filter(user => user.uid != this.currentUser.value?.uid).map(user => user.displayName) ?? [];
    });
  }

  async scanMessage(newChat: ChatDisplay): Promise<ChatDisplay> {
    const numberOfOldMessages = this.chat.value?.messages.length ?? 0;
    for (let i = 0; i < newChat.messages.length; i++) {
      if (i + 1 < numberOfOldMessages) {
        continue
      }
      const message = newChat.messages[i];
      message.isInsult = await this.ai.isInsult(message.content);
    }
    return newChat;
  }

  async createResponse(message: MessageWithInsult) {
    if (!message.isInsult) {
      return;
    }
    const response = await this.ai.generateInsult(message.content);
    this.typingMessage = response;
  }

  async sendMessage() {
    await this.firebase.sendMessage(this.chat.value!.uid, this.typingMessage.trim());
    this.typingMessage = "";
  }
}
