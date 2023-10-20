import { TestBed } from '@angular/core/testing';

import { ChatGptRequestService } from './chat-gpt-request.service';

describe('ChatGptRequestService', () => {
  let service: ChatGptRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatGptRequestService);
  });

  it('should be created', () => {
    service.generateResponse();
  });
});
