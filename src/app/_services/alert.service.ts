import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { Alert, AlertType } from '../_models/alert.model';

@Injectable()
export class AlertService {
  private _keepAfterNavigationChange = false;

  private _alertStream = new Subject<Alert>();
  alertStream$: Observable<Alert>;

  constructor(private router: Router) {
    this.alertStream$ = this._alertStream.asObservable();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this._keepAfterNavigationChange) {
          this._keepAfterNavigationChange = false;
        } else {
          this._alertStream.next(null);
        }
      }
    });
  }

  success(title: string, message: string, keepAfterNavigationChange = false) {
    this._keepAfterNavigationChange = keepAfterNavigationChange;
    this._alertStream.next({ type: AlertType.Success, title: title, message: message });
  }

  error(title: string, message: string, keepAfterNavigationChange = false) {
    this._keepAfterNavigationChange = keepAfterNavigationChange;
    this._alertStream.next({ type: AlertType.Error, title: title, message: message });
  }
}
