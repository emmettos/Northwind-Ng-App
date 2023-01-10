import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Alert, AlertType } from 'src/app/_models/alert.model';
import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  alertType: any = AlertType;
  alert: Alert = null;

  alertClosed = false;

  constructor(private _alertService: AlertService) { }

  ngOnInit(): void {
    this._alertService.alertStream$.pipe(
      takeUntil(this._destroying$)
    )
    .subscribe(alert => {
      this.alert = alert;
      this.alertClosed = false;
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  onClose(): void {
    this.alertClosed = true;
  }
}
