import { Observable, of } from 'rxjs';

import { LogEntry, LogLevel } from './log.service';

export abstract class LogPublisher {
    location: string;

    abstract log(record: LogEntry): Observable<boolean>
    abstract clear(): Observable<boolean>;
}

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    switch (entry.level) {
      case LogLevel.Trace:
      case LogLevel.Debug:
      case LogLevel.Info:
        console.log(entry.buildLogString());
        break;
      case LogLevel.Warn:
        console.warn(entry.buildLogString());
        break;
      case LogLevel.Error:
      case LogLevel.Fatal:
        console.error(entry.buildLogString());
        break;
      default:
        break;
    }

    return of(true);
  }
  
  clear(): Observable<boolean> {
    console.clear();
      
    return of(true);
  }
}
