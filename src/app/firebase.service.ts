import {inject, Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.loggedIn.next(true);
      } else {
        this.loggedIn.next(false);
      }
    }).catch(console.error);
  }

  async signIn(email: string, password: string) {
    const result = await this.auth
      .signInWithEmailAndPassword(email, password);
    await this.router.navigate(['']);
  }

  async signUp(email: string, password: string) {
    const result = await this.auth
      .createUserWithEmailAndPassword(email, password);
    await this.router.navigate(['']);
  }


  async signOut() {
    await this.auth.signOut();
    await this.router.navigate(['login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
