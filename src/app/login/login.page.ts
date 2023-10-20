import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../firebase.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  error: string = "";

  constructor(private firebase: FirebaseService) {
  }

  ngOnInit() {
  }

  async signInWithGoogle() {
    this.error = "";
    await this.firebase.signInWithGoogle().catch(error => {
      this.error = error.code
    });
  }
}
