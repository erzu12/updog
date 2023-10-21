import {Component, inject, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChatGptRequestService} from '../chat-gpt-request.service';
import {Chat, FirebaseService, User} from '../firebase.service';
import {BehaviorSubject} from 'rxjs';
import {IonContent} from "@ionic/angular";

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
  @ViewChild('content')
  container: IonContent | undefined;

  constructor(private firebase: FirebaseService, private ai: ChatGptRequestService) {
    this.currentUser = firebase.currentUser();
    firebase.getChat(this.activatedRoute.snapshot.paramMap.get('id')!).subscribe(chat => {
      this.chat.next(chat);
      setTimeout(() => {
        this.container?.scrollToBottom();
      }, 200);
    });
    this.chat.subscribe(chat => {
      this.participantsDisplayname = chat?.users.filter(user => user.uid != this.currentUser.value?.uid).map(user => user.displayName) ?? [];
    });
  }

  async sendMessage() {
    await this.firebase.sendMessage(this.chat.value!.uid, this.typingMessage.trim());
    this.typingMessage = "";
  }
}
