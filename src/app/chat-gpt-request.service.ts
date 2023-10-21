import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as openai_1 from 'openai';

type ChatMessage = {
  user: string,
  message: string,
}

@Injectable({
  providedIn: 'root'
})
export class ChatGptRequestService {

  constructor() { }

  async isInsult(text: string): Promise<boolean> {
    const prompt = 'the following is a text message. is it insulting?\n\n' + text + '\n\nawnser only as either true or false';
    const resp = await this.generateResponse(prompt, 1);
    const isInsult = resp.toLowerCase() == 'true';

    return isInsult;
  }

  async generateInsult(text: string): Promise<string> {
    const prompt = 'the following is an insult, give a clever response\n\n' + text;
    return await this.generateResponse(prompt, 100);
  }

  async generateAutoResponse(chatHistory: ChatMessage[], user: string): Promise<string[]> {
    let users: string[] = [user];
    for(const message of chatHistory) {
      if(!users.includes(message.user)) {
        users.push(message.user);
      }
    }
    let prompt = 'the following is a chat history between ' + users.length + ' people, i am ' + user + ':\n\n';
    for (const message of chatHistory) {
      prompt += message.user + ': ' + message.message + '\n';
    }
    prompt += '\ngive 3 suggestions for short and casual a responses' + user + 'could write\n\n ' + user +': \n';

    const response = await this.generateResponse(prompt, 100);
    const responses = response.split('\n');
    for (let i = 0; i < responses.length; i++) {
      responses[i] = responses[i].substring(3);
    }
    return responses;
  }

  private async generateResponse(text: string, max_tokens: number): Promise<string> {
    const key = environment.gptApiKey;

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
