import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public chats = [
    { title: 'Andrin Geiger', url: '/folder/inbox', icon: 'mail' },
    { title: 'Dario portmann', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Jonas Fink', url: '/folder/favorites', icon: 'heart' },
    { title: 'Alex Wyss', url: '/folder/archived', icon: 'archive' },
    { title: 'Donald Trump', url: '/folder/trash', icon: 'trash' },
    { title: 'Joe Biden', url: '/folder/spam', icon: 'warning' },
  ]

  public loggedInUser = { displayName: 'Andrin Geiger', email: "homo@gmail.com", img: "https://www.w3schools.com/howto/img_avatar.png"};
  constructor() {}

  public logout() {
    console.log("logout");
  }
}
