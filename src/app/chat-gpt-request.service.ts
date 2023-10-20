import { Injectable } from '@angular/core';
import * as dotenv from 'dotenv';
import * as openai_1 from 'openai';

@Injectable({
  providedIn: 'root'
})
export class ChatGptRequestService {

  constructor() { }

  isInsult(text: string): boolean {
    return text.includes('insult');
  }

  generateResponse(): string {
    console.log(process.env['GPT_API_KEY']);

    //const configuration = new openai_1.Configuration({
      //apiKey: process.env.GPT_API_KEY,
    //});
    //const openai = new openai_1.OpenAIApi(configuration);

    //const prompt = 'test';
    //const chatCompletion = new openai_1.ChatCompletionRequestMessage({
      //model: 'gpt-3.5-turbo-instruct',
      //prompt: prompt,
    //});


    return 'You are an idiot';
  }
}
