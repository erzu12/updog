import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../firebase.service";
import {ThemeSwitcherService} from "../theme-switcher.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string = "";
  email: string = "";
  password: string = "";
  repeatPassword: string = "";
  error: string = "";

  constructor(private firebase: FirebaseService, public themeSwitcher: ThemeSwitcherService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.email = this.activatedRoute.snapshot.paramMap.get('mail') ?? "";
  }

  async signUp() {
    this.error = "";
    await this.firebase.signUp(this.name, this.email, this.password).catch(error => {
      this.error = error.code
    });
  }

  isValid() {
    return this.email.trim().length > 0 && this.password.trim().length > 0 &&
      this.repeatPassword.trim() === this.password.trim() && this.name.trim().length > 0;
  }
}
