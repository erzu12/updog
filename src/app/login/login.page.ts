import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../firebase.service";
import {ThemeSwitcherService} from '../theme-switcher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";
  error: string = "";
  googleError: string = "";

  constructor(private firebase: FirebaseService, public themeSwitcher: ThemeSwitcherService) {
  }

  ngOnInit() {
  }

  async signInWithGoogle() {
    this.googleError = "";
    await this.firebase.signInWithGoogle().catch(error => {
      this.googleError = error.code
    });
  }

  async signIn() {
    this.error = "";
    await this.firebase.signIn(this.email, this.password).catch(error => {
      this.error = error.code
    });
  }
}
