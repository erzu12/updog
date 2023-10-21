import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { BehaviorSubject, Subscription, of } from "rxjs";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}


export type Chat = {
  id: string;
  users: User[];
  messages: Message[];
}

export type Message = {
  senderId: string;
  content: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  private authStateSubscription: Subscription;
  private allUsersSubject = new BehaviorSubject<User[] | undefined>(undefined);
  private allUsersSubscription: Subscription;
  private otherUsersSubject = new BehaviorSubject<User[] | undefined>(undefined);

  private usersCollection: AngularFirestoreCollection<User>;

  constructor(private auth: AngularFireAuth, private router: Router, private store: AngularFirestore) {
    this.usersCollection = this.store.collection('users');
    this.allUsersSubscription = this.usersCollection.valueChanges().subscribe(users => {
      this.allUsersSubject.next(users);
      this.emitOtherUsers();
    });
    this.authStateSubscription = this.auth.authState.subscribe(loggedInUser => {
      if (loggedInUser) {
        const userData: User = {
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          displayName: loggedInUser.displayName ?? loggedInUser.email,
          photoURL: loggedInUser.photoURL ?? "https://www.w3schools.com/howto/img_avatar.png"
        };
        this.userSubject.next(userData);
        this.emitOtherUsers();
        this.usersCollection.doc(userData.uid).set(userData).catch(console.error);
      } else {
        this.userSubject.next(undefined);
        this.otherUsersSubject.next(undefined);
      }
    });
  }

  private emitOtherUsers() {
    this.otherUsersSubject.next(this.allUsersSubject.value?.filter(user => user.uid !== this.userSubject.value?.uid));
  }

  ngOnDestroy(): void {
    this.allUsersSubscription.unsubscribe();
    this.authStateSubscription.unsubscribe();
  }

  async signInWithGoogle() {
    await this.auth.signInWithPopup(new GoogleAuthProvider());
    await this.router.navigate(['']);
  }

  async signOut() {
    await this.auth.signOut();
    await this.router.navigate(['login']);
  }

  currentUser(): BehaviorSubject<User | undefined> {
    return this.userSubject;
  }

  allUsers(): BehaviorSubject<User[] | undefined> {
    return this.allUsersSubject;
  }

  otherUsers(): BehaviorSubject<User[] | undefined> {
    return this.otherUsersSubject;
  }

  async sendMessage(chatId: string, content: string) {
    //firestore.collection('messages').add(message).catch(console.error);
  }

  getChat(chatId: string): BehaviorSubject<Chat | undefined> {
    return new BehaviorSubject({
      id: chatId,
      users: [this.currentUser().value!, this.currentUser().value!],
      messages: [
        {
          content: 'Hello',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'd',
          senderId: '2',
          timestamp: new Date()
        },
        {
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          senderId: '2',
          timestamp: new Date()
        },
        {
          content: 'a',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'd',
          senderId: '2',
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'asd',
          senderId: '2',
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'dad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
        {
          content: 'daddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddaddad',
          senderId: this.userSubject.value!.uid,
          timestamp: new Date()
        },
      ]
    } as Chat | undefined);
  }
}
