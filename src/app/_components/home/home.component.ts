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

  apiData: any[];
  apiColumns: string[];

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
      .subscribe({
        next: response => { 
          this.apiData = response;
          this.apiColumns = Object.keys(this.apiData[0]);
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      })
  }

  getProductCategories() {
    this.httpClient.get<any>('https://localhost:7271/api/category')
      .subscribe({
        next: response => { 
          this.apiData = response;
          this.apiColumns = Object.keys(this.apiData[0]);
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
          error: error => {
        }
      })
  }

  addSupplier() {
    // this.httpClient.get<any>('https://localhost:7271/api/category')
    //   .subscribe(response => { 
    //     this.apiData = response;
    //     this.apiColumns = Object.keys(this.apiData[0]);
    //   })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
