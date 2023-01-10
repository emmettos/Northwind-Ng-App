import { Injectable } from "@angular/core";

import { BehaviorSubject, from, Observable } from "rxjs";

import { AccountInfo, AuthenticationResult, Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';

import { MSAL_AD_APP_ROLES_SCOPE, MSAL_AD_CLIENT_ID, MSAL_ADB2C_APP_ROLES_SCOPE, MSAL_ADB2C_CLIENT_ID, MSAL_CONFIG_MAP } from "./msal.config";

import { LogService } from "./log.service";

@Injectable()
export class MsalService {
  private _publicClientApplication: PublicClientApplication;

  private _loggedInUser: BehaviorSubject<AccountInfo>;
  loggedInUser$: Observable<AccountInfo>;

  constructor(private _logService: LogService) {
    this._loggedInUser = new BehaviorSubject<AccountInfo>(null);
    this.loggedInUser$ = this._loggedInUser.asObservable();
  }

  customerLogin(): void {
    this.initializeMsal(MSAL_CONFIG_MAP.get(MSAL_ADB2C_CLIENT_ID));

    this._publicClientApplication.loginPopup()
      .then(result => {
        this._logService.debug('Customer login', result);
        this._loggedInUser.next(result.account)
      });
  }

  employeeLogin(): void {
    this.initializeMsal(MSAL_CONFIG_MAP.get(MSAL_AD_CLIENT_ID));

    this._publicClientApplication.loginPopup()
      .then(result => {
        this._logService.debug('Employee login', result);
        this._loggedInUser.next(result.account)
      });
  }

  acquireTokenSilent(): Observable<AuthenticationResult> {
    return from(this._publicClientApplication.acquireTokenSilent({ scopes: [MSAL_AD_APP_ROLES_SCOPE], account: this._loggedInUser.value }));
  }

  acquireTokenPopup(): Observable<AuthenticationResult> {
    return from(this._publicClientApplication.loginPopup({ scopes: [MSAL_AD_APP_ROLES_SCOPE] }));
  }

  logout(): void {
    this._publicClientApplication.logoutPopup()
      .then(() => this._loggedInUser.next(null))
  }

  private initializeMsal(configuration: Configuration) {
    configuration.system.loggerOptions.loggerCallback = (logLevel, message, containsPii) => {
      switch (logLevel) {
        case LogLevel.Trace:
          this._logService.trace(message);
          break;
        case LogLevel.Verbose:
          this._logService.debug(message);
          break;
        case LogLevel.Info:
          this._logService.info(message);
          break;
        case LogLevel.Warning:
          this._logService.warn(message);
          break;
        case LogLevel.Error:
          this._logService.error(message);
        default:
          break;
      }
    };

    this._publicClientApplication = new PublicClientApplication(configuration);

    this._publicClientApplication.initialize();
  }
}
