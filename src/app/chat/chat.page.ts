import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatGptRequestService } from '../chat-gpt-request.service';
import { Chat, FirebaseService, User } from '../firebase.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  public chat: BehaviorSubject<Chat | undefined> = new BehaviorSubject<Chat | undefined>(undefined);
  public typingMessage = '';
  private activatedRoute = inject(ActivatedRoute)
  public currentUser: BehaviorSubject<User | undefined>;
  public participantsDisplayname: string[] = [];

  constructor(private firebase: FirebaseService, private ai: ChatGptRequestService) {
    this.currentUser = firebase.currentUser();
    this.chat = firebase.getChat(this.activatedRoute.snapshot.paramMap.get('id')!);
    this.chat.subscribe(chat => {
      chat?.users.filter(user => user.uid != this.currentUser.value?.uid).map(user => this.participantsDisplayname.push(user.displayName!));
    });
  }

  async sendMessage() {
    await this.firebase.sendMessage(this.chat.value!.id, this.typingMessage);
  }
}