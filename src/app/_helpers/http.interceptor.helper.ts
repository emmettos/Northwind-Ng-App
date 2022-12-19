import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { switchMap, catchError } from "rxjs/operators";

import { AuthenticationResult } from "@azure/msal-browser";

import { MsalService } from "../_services/msal.service";

@Injectable()
export class HttpInterceptorHelper implements HttpInterceptor {
  constructor(private msalService: MsalService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.msalService.acquireTokenSilent()
      .pipe(
        catchError(() => {
          console.error('Interceptor - acquireTokenSilent rejected with error. Invoking interaction to resolve.');

          return this.msalService.acquireTokenPopup();
        }),
        switchMap((result: AuthenticationResult) => {
          if (!result.accessToken) {
            console.error('Interceptor - acquireTokenSilent resolved with null access token. Known issue with B2C tenants, invoking interaction to resolve.');
            
            return this.msalService.acquireTokenPopup();
          }

          return of(result);
        }),
        switchMap((result: AuthenticationResult) => {
          console.log('Interceptor - setting authorization header');

          const headers = req.headers.set('Authorization', `Bearer ${result.accessToken}`);

          const requestClone = req.clone({ headers });
          
          return next.handle(requestClone);
        })
      );
  }
}
