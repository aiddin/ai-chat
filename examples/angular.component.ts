// Angular Component Example
import { Component, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@a.izzuddin/ai-chat';
import type { Message } from '@a.izzuddin/ai-chat';

@Component({
  selector: 'app-chat',
  template: `
    <ai-chat
      #chatElement
      [attr.api-url]="apiUrl"
      [attr.session-id]="sessionId"
      [attr.title]="title"
      [attr.theme]="theme">
    </ai-chat>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('chatElement') chatElement!: ElementRef;

  apiUrl = 'http://localhost:8000';
  sessionId = 'user-123';
  title = 'AI Assistant';
  theme: 'light' | 'dark' = 'light';

  ngAfterViewInit() {
    const chat = this.chatElement.nativeElement;

    chat.addEventListener('message-sent', (e: CustomEvent<Message>) => {
      console.log('Message sent:', e.detail);
    });

    chat.addEventListener('response-received', (e: CustomEvent<Message>) => {
      console.log('Response received:', e.detail);
    });

    chat.addEventListener('error', (e: CustomEvent<Error>) => {
      console.error('Error:', e.detail);
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }
}
