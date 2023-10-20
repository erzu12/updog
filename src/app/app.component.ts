import {Component} from '@angular/core';
import {FirebaseService} from "./firebase.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {title: 'Inbox', url: '/folder/inbox', icon: 'mail'},
    {title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane'},
    {title: 'Favorites', url: '/folder/favorites', icon: 'heart'},
    {title: 'Archived', url: '/folder/archived', icon: 'archive'},
    {title: 'Trash', url: '/folder/trash', icon: 'trash'},
    {title: 'Spam', url: '/folder/spam', icon: 'warning'},
  ];
  loggedIn$: Observable<boolean> | undefined;

  constructor(private firebase: FirebaseService) {
    this.loggedIn$ = firebase.isLoggedIn();
  }

  async signOut() {
    await this.firebase.signOut();
  }
}
