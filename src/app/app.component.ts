import {Component} from '@angular/core';
import {FirebaseService} from "./firebase.service";
import {Observable} from "rxjs";
import { ChatGptRequestService } from './chat-gpt-request.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public chats = [
    { displayName: 'Andrin Geiger', chatId: 1, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Dario portmann', chatId: 10, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Jonas Fink', chatId: 2, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Alex Wyss', chatId: 20, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Donald Trump', chatId: 3, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Joe Biden', chatId: 30, img: "https://www.w3schools.com/howto/img_avatar.png" },
  ]

  public loggedInUser = { displayName: 'Andrin Geiger', email: "homo@gmail.com", img: "https://www.w3schools.com/howto/img_avatar.png" };
  loggedIn$: Observable<boolean> | undefined;

  constructor(private firebase: FirebaseService) {
    this.loggedIn$ = firebase.isLoggedIn();

  }

  async signOut() {
    await this.firebase.signOut();
  }

  async getResponse() {
    const service = new ChatGptRequestService();
    await service.generateResponse().then((response) => {});
  }
}
