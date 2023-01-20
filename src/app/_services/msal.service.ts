import { Injectable } from "@angular/core";

import { BehaviorSubject, from, Observable, tap } from "rxjs";

import { AccountInfo, AuthenticationResult, Configuration, LogLevel, PublicClientApplication } from '@azure/msal-browser';

import { MSAL_AD_APP_ROLES_SCOPE, MSAL_AD_CLIENT_ID, MSAL_ADB2C_APP_ROLES_SCOPE, MSAL_ADB2C_CLIENT_ID, MSAL_CONFIG_MAP } from "./msal.config";

import { LogService } from "./log.service";

export enum UserType {
  Customer,
  Employee,
  NotDefined
}

export type AccountInfoWithUserType = AccountInfo & { userType: UserType }

@Injectable({
  providedIn: 'root'
})
export class MsalService {
  private _publicClientApplication: PublicClientApplication;

  private _loggedInUser: BehaviorSubject<AccountInfoWithUserType>;
  loggedInUser$: Observable<AccountInfoWithUserType>;

  private _userType: UserType = UserType.NotDefined;

  constructor(private _logService: LogService) {
    this._loggedInUser = new BehaviorSubject<AccountInfoWithUserType>(null);
    this.loggedInUser$ = this._loggedInUser.asObservable();
  }

  customerLogin(): void {
    this.initializeMsal(MSAL_CONFIG_MAP.get(MSAL_ADB2C_CLIENT_ID));

    this._publicClientApplication.loginPopup()
      .then(result => {
        this._logService.debug('Customer login', result);

        this._userType = UserType.Customer;

        this._loggedInUser.next({
          ...result.account,
          userType: UserType.Customer
        });
      });
  }

  employeeLogin(): void {
    this.initializeMsal(MSAL_CONFIG_MAP.get(MSAL_AD_CLIENT_ID));

    this._publicClientApplication.loginPopup()
      .then(result => {
        this._logService.debug('Employee login', result);

        this._userType = UserType.Employee;

        this._loggedInUser.next({
          ...result.account,
          userType: UserType.Employee
        });
      });
  }

  acquireTokenSilent(): Observable<AuthenticationResult> {
    let returnValue: Observable<AuthenticationResult> = null;

    let request: any = null;

    switch (this._userType) {
      case UserType.Customer:
        request = { scopes: [MSAL_ADB2C_APP_ROLES_SCOPE], account: this._loggedInUser.value };
        break;
      case UserType.Employee:
        request = { scopes: [MSAL_AD_APP_ROLES_SCOPE], account: this._loggedInUser.value };
        break;
      default:
        break;
    }

    return from(this._publicClientApplication.acquireTokenSilent(request))
  }

  acquireTokenPopup(): Observable<AuthenticationResult> {
    let returnValue: Observable<AuthenticationResult> = null;

    let request: any = null;

    switch (this._userType) {
      case UserType.Customer:
        request = { scopes: [MSAL_ADB2C_APP_ROLES_SCOPE] };

        returnValue = from(this._publicClientApplication.loginPopup(request))
                        .pipe(
                          tap((result: AuthenticationResult) => {
                            this.broadcastLogin(result, UserType.Customer)
                          }));
        break;
      case UserType.Employee:
        request = { scopes: [MSAL_AD_APP_ROLES_SCOPE] };

        returnValue = from(this._publicClientApplication.loginPopup(request))
                        .pipe(
                          tap((result: AuthenticationResult) => {
                            this.broadcastLogin(result, UserType.Employee)
                          }));
        break;
      default:
        break;
    }

    return returnValue;
  }

  logout(): void {
    this._publicClientApplication.logoutPopup()
      .then(() => this._loggedInUser.next(null))
  }

  private initializeMsal(configuration: Configuration): void {
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

  private broadcastLogin(result: AuthenticationResult, userType: UserType) {
    switch (userType) {
      case UserType.Customer:
        this._logService.debug('Customer login', result);
        break;
      case UserType.Employee:
        this._logService.debug('Employee login', result);
        break;
      default:
        break;
    }

    this._loggedInUser.next({
      ...result.account,
      userType: userType
    });
  }
}
