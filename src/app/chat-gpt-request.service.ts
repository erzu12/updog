import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as openai_1 from 'openai';

@Injectable({
  providedIn: 'root'
})
export class ChatGptRequestService {

  constructor() { }

  async isInsult(text: string): Promise<boolean> {
    const prompt = 'the following is a text message. is it insulting?\n\n' + text + '\n\nawnser only as either true or false';
    const resp = await this.generateResponse(prompt, 1);
    console.log(resp.toLowerCase());
    const isInsult = resp.toLowerCase() == 'true';

    return isInsult;
  }

  async generateInsult(text: string): Promise<string> {
    const prompt = 'the following is an insult, give a clever response\n\n' + text;
    return await this.generateResponse(prompt, 100);
  }

  async generateResponse(text: string, max_tokens: number): Promise<string> {
    console.log('Generating response');
    const key = environment.gptApiKey;
    console.log(key);

    const openai = new openai_1.OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: text }],
      model: 'gpt-3.5-turbo',
      max_tokens: max_tokens,
    }).then((response) => response); //cursed code pls dont look


    const message = chatCompletion.choices[0]!.message.content!;

    return message;
  }
}
