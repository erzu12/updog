import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {GoogleAuthProvider, UserInfo} from "@angular/fire/auth";
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

interface ChatData {
  uid: string;
  userIds: string[];
  messages: MessageData[];
}

interface MessageData {
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
  private authStateSubscription: Subscription | undefined;
  private allUsersSubject = new BehaviorSubject<Map<string, User>>(new Map());
  private allUsersSubscription: Subscription | undefined;
  private otherUsersSubject = new BehaviorSubject<User[]>([]);
  private chatsSubject = new BehaviorSubject<ChatReference[]>([]);
  private chatsSubscription: (() => void) | undefined;

  private usersCollection: AngularFirestoreCollection<User>;
  private chatsCollection: AngularFirestoreCollection<ChatData>;

  constructor(private auth: AngularFireAuth, private router: Router, private store: AngularFirestore) {
    this.usersCollection = this.store.collection('users');
    this.chatsCollection = this.store.collection('chats');
    this.initAllUsers().then(() => {
      this.authStateSubscription = this.auth.authState.subscribe(loggedInUser => {
        if (loggedInUser) {
          const userData = this.updateUser(loggedInUser);
          this.emitOtherUsers();
          this.chatsSubscription?.();
          this.chatsSubscription = this.loadChats(userData);
        } else {
          this.userSubject.next(undefined);
          this.otherUsersSubject.next([]);
          this.chatsSubscription?.();
          this.chatsSubject.next([]);
        }
      });
    });
  }

  private initAllUsers() {
    return new Promise<void>(resolve => {
      let isResolved = false;
      this.allUsersSubscription = this.usersCollection.valueChanges().subscribe(users => {
        this.allUsersSubject.next(users.reduce((accumulator, user) => {
            return accumulator.set(user.uid, user);
          }, new Map())
        );
        this.emitOtherUsers();
        if (!isResolved) {
          isResolved = true;
          resolve();
        }
      });
    });
  }

  private updateUser(loggedInUser: UserInfo) {
    const userData: User = {
      uid: loggedInUser.uid,
      email: loggedInUser.email ?? loggedInUser.uid,
      displayName: loggedInUser.displayName ?? loggedInUser.email ?? loggedInUser.uid,
      photoURL: loggedInUser.photoURL ?? "https://www.w3schools.com/howto/img_avatar.png"
    };
    this.userSubject.next(userData);
    this.usersCollection.doc(userData.uid).set(userData).catch(console.error);
    return userData;
  }


  private loadChats(userData: User) {
    return this.chatsCollection.ref.where('userIds', "array-contains", userData.uid).onSnapshot(snapshot => {
      this.chatsSubject.next(snapshot.docs.map(doc => {
        const chat = doc.data();
        const otherUsers = chat.userIds.filter(userId => userId !== userData.uid);
        let image = "assets/group_avatar.png";
        if (otherUsers.length === 1) {
          image = this.allUsersSubject.value.get(otherUsers[0])?.photoURL ?? image;
        }
        return {
          uid: chat.uid,
          image: image,
          displayName: otherUsers.map(userId => this.allUsersSubject.value.get(userId)?.displayName).join(", ")
        };
      }))
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
    this.allUsersSubscription?.unsubscribe();
    this.authStateSubscription?.unsubscribe();
    this.chatsSubscription?.();
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

  async createChat(participants: string[]) {
    const id = this.store.createId();
    await this.chatsCollection.doc(id).set({
      uid: id,
      userIds: participants,
      messages: []
    });
  }

  chats(): BehaviorSubject<ChatReference[]> {
    return this.chatsSubject;
  }

  getChat(chatId: string): Observable<Chat> {
    return this.chatsCollection.doc(chatId).valueChanges().pipe(map(chatData => {
      if (chatData) {
        return {
          ...chatData,
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
      return await this.chatsCollection.doc(chatId).update({
        messages: arrayUnion({
          senderId: senderId,
          content: content,
          timestamp: moment().toISOString()
        }) as unknown as MessageData[]
      });
    }
    throw new Error('User not logged in.');
  }
}

