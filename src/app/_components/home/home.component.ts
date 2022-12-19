import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountInfo } from '@azure/msal-browser';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MsalService } from '../../_services/msal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedInUser: AccountInfo;

  private readonly _destroying$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private msalService: MsalService) { }

  ngOnInit(): void {
    this.msalService.loggedInUser$.pipe(
      takeUntil(this._destroying$)
    )
    .subscribe(userAccount => this.loggedInUser = userAccount);
  }

  customerLogin() {
    this.msalService.customerLogin();
  }
  
  employeeLogin() {
    this.msalService.employeeLogin();
  }
  
  getOrders() {
  }

  getSuppliers() {
    this.httpClient.get<any>('https://localhost:7271/api/supplier')
      .subscribe(data => {
        console.log(data);
      })
  }

  getProductCategories() {
    this.httpClient.get<any>('https://localhost:7271/api/category')
      .subscribe(data => {
        console.log(data);
      })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
