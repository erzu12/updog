import {Component, OnDestroy} from '@angular/core';
import {ChatReference, FirebaseService, User} from "./firebase.service";
import {ChatGptRequestService} from './chat-gpt-request.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  chats: ChatReference[] = []
  user: User | undefined;
  private subscriptions: Subscription[] = [];

  constructor(private firebase: FirebaseService) {
    this.subscriptions.push(firebase.currentUser().subscribe(user => this.user = user));
    this.subscriptions.push(firebase.chats().subscribe(chats => this.chats = chats));
  }

  async signOut() {
    await this.firebase.signOut();
  }

  async getResponse() {
    const service = new ChatGptRequestService();
    const chatHistory = [
      {user: 'Jonas', message: 'hello'},
      {user: 'Andrin', message: 'hi'},
      {user: 'Jonas', message: 'have you heard of updog?'},
      {user: 'Andrin', message: 'what is updog?'},
      {user: 'Jonas', message: 'not much, what is up with you?'},
    ];

    const messsage = 'what is updog?';

    if(await service.isInsult(messsage)) {
      const response = await service.generateInsult(messsage);
      console.log(response);
    }
    else {
      const response = await service.generateAutoResponse(chatHistory, 'Jonas');
      console.log(response);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
