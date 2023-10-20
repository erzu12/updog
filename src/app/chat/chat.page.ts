import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  public chat!: Chat;
  public loggedInUserId = 1;
  public typingMessage = '';
  private activatedRoute = inject(ActivatedRoute)
  ngOnInit() {
    const chatId = this.activatedRoute.snapshot.paramMap.get('id');
    this.chat = {
      id: 1,
      participant: 'John Doe',
      messages: [
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 2,
          senderId: 2,
          content: 'Hi',
          timestamp: new Date()
        },
        {
          id: 3,
          senderId: 1,
          content: 'How are you?',
          timestamp: new Date()
        },
        {
          id: 4,
          senderId: 2,
          content: 'I am fine',
          timestamp: new Date()
        },
        {
          id: 5,
          senderId: 1,
          content: 'Good to hear that',
          timestamp: new Date()
        },
        {
          id: 6,
          senderId: 2,
          content: 'See you later',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        },
        {
          id: 1,
          senderId: 1,
          content: 'HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello',
          timestamp: new Date()
        }
      ]
    };// load chat from firebase using chatId;
  }

}
type Chat = {
  id: number;
  participant: string;
  messages: Message[];
}
type Message = {
  id: number;
  senderId: number;
  content: string;
  timestamp: Date;
}