import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatGptRequestService } from '../chat-gpt-request.service';
import { Chat, FirebaseService, Message, User } from '../firebase.service';
import { BehaviorSubject, Subscription } from 'rxjs';
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
export class ChatPage implements OnDestroy {
  public chat: BehaviorSubject<ChatDisplay | undefined> = new BehaviorSubject<ChatDisplay | undefined>(undefined);
  public typingMessage = '';
  public creatingResponse = false;
  public typingInProgress = false;
  public loadingNormalResponse = false;
  private activatedRoute = inject(ActivatedRoute)
  public currentUser: BehaviorSubject<User | undefined>;
  public participantsDisplayname: string[] = [];
  public isActionSheetOpen = false;
  public actionSheetButtons: any = [];
  @ViewChild('content')
  container: IonContent | undefined;
  private subscriptions: Subscription[] = [];

  constructor(private firebase: FirebaseService, private ai: ChatGptRequestService) {
    this.currentUser = firebase.currentUser();
    this.subscriptions.push(firebase.getChat(this.activatedRoute.snapshot.paramMap.get('id')!).subscribe(async chat => {
      let newChat: ChatDisplay = { ...chat, messages: chat.messages.map<MessageWithInsult>(message => ({ ...message, isInsult: false })) };
      if (this.chat?.value?.messages) {
        newChat = await this.scanMessage(newChat);
      }
      this.chat.next(newChat);
      setTimeout(() => {
        this.container?.scrollToBottom();
      }, 200);
    }));
    this.subscriptions.push(this.chat.subscribe(chat => {
      this.participantsDisplayname = chat?.users.filter(user => user.uid != this.currentUser.value?.uid).map(user => user.displayName) ?? [];
    }));
  }

  async scanMessage(newChat: ChatDisplay): Promise<ChatDisplay> {
    const numberOfNewMessages = newChat.messages.length - this.chat.value!.messages.length;
    const indexOfNewMessages = newChat.messages.length - numberOfNewMessages;
    for (let i = 0; i < newChat.messages.length; i++) {
      if (i < indexOfNewMessages) {
        continue
      }
      const message = newChat.messages[i];
      message.isInsult = await this.ai.isInsult(message.content);
    }
    return newChat;
  }

  async createResponse(message: MessageWithInsult, element: any) {
    if (message.isInsult) {
      this.createComback(message, element);
    } else {
      this.createNormalResponse();
    }
  }

  async createNormalResponse() {
    this.loadingNormalResponse = true;
    const last10Messages = this.chat.value!.messages.slice(-10);
    const response = await this.ai.generateAutoResponse(last10Messages, this.currentUser.value!.displayName)
    this.loadingNormalResponse = false;
    this.isActionSheetOpen = true;
    this.actionSheetButtons = response.map((response, index) => ({
      text: response,
      role: 'destructive',
      handler: async () => {
        this.isActionSheetOpen = false;
        await this.type(this.removeQuotes(response))
      },
    }));
  }

  removeQuotes(inputString: string): string {
    // Check if the string has at least two characters and starts and ends with double quotes
    if (inputString.length >= 2 && inputString.charAt(0) === '"' && inputString.charAt(inputString.length - 1) === '"') {
      // Use substring to remove the first and last characters
      return inputString.substring(1, inputString.length - 1);
    } else {
      // Return the original string if it doesn't meet the criteria
      return inputString;
    }
  }

  async createComback(message: MessageWithInsult, element: any) {
    this.creatingResponse = true;
    element.target.classList.remove('insult');
    const response = await this.ai.generateInsult(message.content);
    this.creatingResponse = false;
    await this.type(response);
  }

  async sendMessage() {
    const message = this.typingMessage.trim();
    this.typingMessage = "";
    await this.firebase.sendMessage(this.chat.value!.uid, message);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private async type(text: string) {
    if (this.typingInProgress) {
      return;
    }
    this.typingInProgress = true;
    const charArray = text.split('');
    const maxDelay = 30;
    const minDelay = 2;
    for (let char of charArray) {
      this.typingMessage += char;
      await new Promise(resolve => setTimeout(resolve, Math.random() * (maxDelay - minDelay) + minDelay));
    }
    this.typingInProgress = false;
  }
}
