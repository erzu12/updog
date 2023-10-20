import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {GoogleAuthProvider, UserInfo} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private user = new BehaviorSubject<UserInfo | undefined>(undefined);

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.user.next(user);
      } else {
        this.user.next(undefined);
      }
    }).catch(console.error);
  }

  async signInWithGoogle() {
    await this.auth.signInWithPopup(new GoogleAuthProvider());
    await this.router.navigate(['']);
  }

  async signOut() {
    await this.auth.signOut();
    await this.router.navigate(['login']);
  }

  currentUser(): BehaviorSubject<UserInfo | undefined> {
    return this.user;
  }
}
