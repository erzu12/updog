import { Component, OnDestroy } from '@angular/core';
import { ChatReference, FirebaseService, User } from "./firebase.service";
import { ChatGptRequestService } from './chat-gpt-request.service';
import { Observable, Subscription } from "rxjs";
import { ThemeSwitcherService } from './theme-switcher.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  chats: ChatReference[] = []
  user: User | undefined;
  private subscriptions: Subscription[] = [];
  otherUsers$: Observable<User[]>;
  participants: string[] = [];

  constructor(
    private firebase: FirebaseService,
    public themeSwitcher: ThemeSwitcherService,
    private popoverController: PopoverController) {
    this.subscriptions.push(firebase.currentUser().subscribe(user => this.user = user));
    this.subscriptions.push(firebase.chats().subscribe(chats => this.chats = chats));
    this.otherUsers$ = firebase.otherUsers();
  }

  async signOut() {
    await this.firebase.signOut();
    this.popoverController.dismiss();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createChat() {
    this.firebase.createChat(this.participants).catch(console.error);
    this.participants = [];
    this.popoverController.dismiss().catch(console.error);
  }
}
