import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as openai_1 from 'openai';

@Injectable({
  providedIn: 'root'
})
export class ChatGptRequestService {

  constructor() { }

  isInsult(text: string): boolean {
    return text.includes('insult');
  }

  async generateResponse(): Promise<string> {
    console.log('Generating response');
    const key = environment.gptApiKey;
    console.log(key);

    const openai = new openai_1.OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });

    let chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo',
    });

    console.error(chatCompletion);


    return 'You are an idiot';
  }
}
