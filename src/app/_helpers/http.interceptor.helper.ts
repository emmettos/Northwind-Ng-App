import { Injectable, Injector } from "@angular/core";
import { HttpHandler, HttpErrorResponse, HttpEvent, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";

import { Observable, of} from "rxjs";
import { switchMap, catchError, tap } from "rxjs/operators";

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationResult } from "@azure/msal-browser";

import { AlertService } from "../_services/alert.service";
import { LogService } from "../_services/log.service";
import { MsalService } from "../_services/msal.service";

@Injectable()
export class HttpInterceptorHelper implements HttpInterceptor {
  constructor(private _injector: Injector, private _logService: LogService, private _msalService: MsalService, private _matSnackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this._msalService.acquireTokenSilent()
      .pipe(
        catchError(() => {
          this._logService.debug('Interceptor - acquireTokenSilent rejected with error. Invoking interaction to resolve.');

          return this._msalService.acquireTokenPopup();
        }),
        // switchMap((result: AuthenticationResult) => {
        //   if (!result.accessToken) {
        //     this._logService.warn('Interceptor - acquireTokenSilent resolved with null access token. Known issue with B2C tenants, invoking interaction to resolve.');

        //     return this._msalService.acquireTokenPopup();
        //   }

        //   return of(result);
        // }),
        switchMap((result: AuthenticationResult) => {
          this._logService.trace('Interceptor - setting authorization header', result.accessToken);

          const headers = req.headers.set('Authorization', `Bearer ${ result.accessToken }`);

          const requestClone = req.clone({ headers });

          return next.handle(requestClone)
            .pipe(
              tap({
                next: (event: HttpEvent<any>) => {
                  if (event instanceof HttpResponse) {
                    this._logService.trace('HTTP response recieved', event)
                  }
                },
                error: (error: any) => {
                  if (error instanceof HttpErrorResponse) {
                    this._logService.error('HTTP error Response received:', error);

                    if (error.status === 403) {
                      this._matSnackBar.open('Unauthorized access!!!', null, { panelClass: ['notification', 'error'], duration: 3000 });
                    }
                    else {
                      let alertService: AlertService = this._injector.get(AlertService);

                      alertService.error(error.message, error.error.error ? error.error.error.message: '');
                    }
                  }
                }
              }),
            );
        })
      );
  }
}
