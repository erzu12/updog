import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {GoogleAuthProvider} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {BehaviorSubject, map, Observable, Subscription} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {arrayUnion} from "@angular/fire/firestore";
import * as moment from 'moment';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface ChatReference {
  uid: string;
  displayName: string;
  image: string;
}

export interface ChatData {
  uid: string;
  userIds: string[];
  messages: MessageData[];
}

export interface MessageData {
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Chat extends ChatData {
  users: User[];
  messages: Message[];
}

export interface Message extends MessageData {
  sender: User;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  private authStateSubscription: Subscription;
  private allUsersSubject = new BehaviorSubject<Map<string, User>>(new Map());
  private allUsersSubscription: Subscription;
  private otherUsersSubject = new BehaviorSubject<User[]>([]);

  private usersCollection: AngularFirestoreCollection<User>;
  private chatsCollection: AngularFirestoreCollection<ChatData>;

  constructor(private auth: AngularFireAuth, private router: Router, private store: AngularFirestore) {
    this.usersCollection = this.store.collection('users');
    this.chatsCollection = this.store.collection('chats');
    this.allUsersSubscription = this.usersCollection.valueChanges().subscribe(users => {
      this.allUsersSubject.next(users.reduce((accumulator, user) => {
          return accumulator.set(user.uid, user);
        }, new Map())
      );
      this.emitOtherUsers();
    });
    this.authStateSubscription = this.auth.authState.subscribe(loggedInUser => {
      if (loggedInUser) {
        const userData: User = {
          uid: loggedInUser.uid,
          email: loggedInUser.email ?? loggedInUser.uid,
          displayName: loggedInUser.displayName ?? loggedInUser.email ?? loggedInUser.uid,
          photoURL: loggedInUser.photoURL ?? "https://www.w3schools.com/howto/img_avatar.png"
        };
        this.userSubject.next(userData);
        this.emitOtherUsers();
        this.usersCollection.doc(userData.uid).set(userData).catch(console.error);
      } else {
        this.userSubject.next(undefined);
        this.otherUsersSubject.next([]);
      }
    });
  }

  private emitOtherUsers() {
    let currentUserId = this.userSubject.value?.uid;
    if (currentUserId) {
      this.otherUsersSubject.next([...this.allUsersSubject.value?.values()].filter(user => user.uid !== currentUserId));
    } else {
      this.otherUsersSubject.next([]);
    }
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

  otherUsers(): BehaviorSubject<User[]> {
    return this.otherUsersSubject;
  }

  chats(): Observable<ChatReference[]> {
    return this.otherUsersSubject.pipe(map(users =>
      users.map(user => {
        return {
          uid: [user.uid, this.userSubject.value?.uid].sort().join(":"),
          displayName: user.displayName,
          image: user.photoURL
        };
      })));
  }

  getChat(chatId: string): Observable<Chat> {
    return this.chatsCollection.doc(chatId).valueChanges().pipe(map(chatData => {
      if (chatData) {
        return {
          uid: chatData.uid,
          userIds: chatData.userIds,
          users: chatData.userIds.map(userId => this.getUser(userId)),
          messages: chatData.messages.map(message => {
            return {
              sender: this.getUser(message.senderId),
              ...message
            };
          })
        };
      }
      throw new Error('Invalid chatId.');
    }));
  }

  private getUser(userId: string) {
    const user = this.allUsersSubject.value.get(userId);
    if (user) {
      return user;
    }
    throw new Error("Invalid userId.");
  }

  async sendMessage(chatId: string, content: string) {
    const senderId = this.userSubject.value?.uid;
    if (senderId) {
      await this.chatsCollection.doc(chatId).set({
        messages: arrayUnion({
          senderId: senderId,
          content: content,
          timestamp: moment().toISOString()
        }) as unknown as MessageData[], uid: chatId, userIds: chatId.split(':')
      });
    }
    throw new Error('User not logged in.');
  }
}
