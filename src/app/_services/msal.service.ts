import { Injectable } from "@angular/core";

import { BehaviorSubject, from, Observable } from "rxjs";

import { AccountInfo, AuthenticationResult, Configuration, PublicClientApplication } from '@azure/msal-browser';

import { MSAL_AD_APP_ROLES_SCOPE, MSAL_AD_CLIENT_ID, MSAL_ADB2C_APP_ROLES_SCOPE, MSAL_ADB2C_CLIENT_ID, MSAL_CONFIG_MAP } from "./msal.config";

@Injectable()
export class MsalService {
  private _publicClientApplication: PublicClientApplication;

  private _loggedInUser: BehaviorSubject<AccountInfo>;
  loggedInUser$: Observable<AccountInfo>;

  constructor() {
    this._loggedInUser = new BehaviorSubject<AccountInfo>(null);
    this.loggedInUser$ = this._loggedInUser.asObservable();
  }

  customerLogin(): void {
    this.initializeMsal(MSAL_CONFIG_MAP.get(MSAL_ADB2C_CLIENT_ID));

    this._publicClientApplication.loginPopup()
      .then(result => { 
        console.log(result);
        this._loggedInUser.next(result.account)
      });
  }

  employeeLogin(): void {
    this.initializeMsal(MSAL_CONFIG_MAP.get(MSAL_AD_CLIENT_ID));

    this._publicClientApplication.loginPopup()
      .then(result => { 
        console.log(result); 
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
    this._publicClientApplication = new PublicClientApplication(configuration);

    this._publicClientApplication.initialize();
  }
}
