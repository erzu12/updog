import {Component, OnDestroy} from '@angular/core';
import {FirebaseService} from "./firebase.service";
import { ChatGptRequestService } from './chat-gpt-request.service';
import {Subscription} from "rxjs";
import {UserInfo} from "@angular/fire/auth";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy{
  public chats = [
    { displayName: 'Andrin Geiger', chatId: 1, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Dario portmann', chatId: 10, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Jonas Fink', chatId: 2, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Alex Wyss', chatId: 20, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Donald Trump', chatId: 3, img: "https://www.w3schools.com/howto/img_avatar.png" },
    { displayName: 'Joe Biden', chatId: 30, img: "https://www.w3schools.com/howto/img_avatar.png" },
  ]

  private subscription: Subscription;
  user: UserInfo | undefined;

  constructor(private firebase: FirebaseService) {
    this.subscription = firebase.currentUser().subscribe(user => this.user = user);
  }

  async signOut() {
    await this.firebase.signOut();
  }

  async getResponse() {
    const service = new ChatGptRequestService();
    const messsage = 'headass';
    if(await service.isInsult(messsage)) {
      const response = await service.generateInsult(messsage);
      console.log(response);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
