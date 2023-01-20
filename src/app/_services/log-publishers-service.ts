import { Injectable } from '@angular/core';

import { LogConsole, LogPublisher } from './log-publishers';

@Injectable({
  providedIn: 'root'
})
export class LogPublishersService {
  publishers: LogPublisher[] = [];

  constructor() {
    this.buildPublishers();
  }

  private buildPublishers(): void {
    this.publishers.push(new LogConsole());
  }
}
