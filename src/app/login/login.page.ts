import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../firebase.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";
  error: string = "";

  constructor(private firebase: FirebaseService) {
  }

  ngOnInit() {
  }

  async signUp() {
    this.error = "";
    await this.firebase.signUp(this.email, this.password).catch(error => {
      this.error = error.code
    });
  }

  async signIn() {
    this.error = "";
    await this.firebase.signIn(this.email, this.password).catch(error => {
      this.error = error.code
    });
  }
}
