import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwitcherService {

  constructor() { 
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.initializeDarkTheme(prefersDark.matches);

    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));
  }

  toggle = false;

  initializeDarkTheme(isDark: boolean) {
    this.toggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
    this.toggle = shouldAdd;
  }
}
