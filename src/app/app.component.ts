import { Component, OnInit } from '@angular/core';

import { AccountInfo } from '@azure/msal-browser';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MsalService } from './_services/msal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Northwind Traders Ltd.';
  loggedInUser: AccountInfo;
  
  private readonly _destroying$ = new Subject<void>();

  constructor(private msalService: MsalService) { }

  ngOnInit() {
    this.msalService.loggedInUser$.pipe(
      takeUntil(this._destroying$)
    )
    .subscribe(userAccount => this.loggedInUser = userAccount);
  }

  logout() { 
    this.msalService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
