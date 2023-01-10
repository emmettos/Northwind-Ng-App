import { Injectable } from '@angular/core';

import { LogPublisher } from './log-publishers';
import { LogPublishersService } from './log-publishers-service';

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

@Injectable()
export class LogService {
  level: LogLevel = LogLevel.Trace;
  logWithDate: boolean = true;

  private _logPublishers: LogPublisher[];

  constructor(private _logPublishersService: LogPublishersService) {
    this._logPublishers = this._logPublishersService.publishers;
  }

  trace(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Trace, optionalParams);
  }

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();

      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (let logPublisher of this._logPublishers) {
        logPublisher.log(entry).subscribe(response => {});
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if ((level >= this.level && level !== LogLevel.Off) || this.level === LogLevel.Trace) {
      return true;
    }

    return false;
  }
}

export class LogEntry {
  entryDate: Date = new Date();
  message: string = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate: boolean = true;

  buildLogString(): string {
      let logString: string = '';

      if (this.logWithDate) {
        logString = new Date() + ' - ';
      }

      logString += 'Type: ' + LogLevel[this.level];
      logString += ' - Message: ' + this.message;

      if (this.extraInfo.length) {
        logString += ' - Extra Info: ' + this.formatParams(this.extraInfo);
      }

      return logString;
  }

  private formatParams(params: any[]): string {
      let formattedParams: string = params.join(',');

      if (params.some(p => typeof p == 'object')) {
        formattedParams = '';

        for (let item of params) {
            formattedParams += JSON.stringify(item) + ',';
        }
      }

      return formattedParams;
  }
}
