import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountInfoWithUserType, MsalService, UserType } from '../../_services/msal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loggedInUser: AccountInfoWithUserType;

  private readonly _destroying$ = new Subject<void>();

  apiData: any[];
  apiColumns: string[];

  constructor(private _httpClient: HttpClient, private _msalService: MsalService, private _matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.apiData = [];
    this.apiColumns = [];

    this._msalService.loggedInUser$.pipe(
      takeUntil(this._destroying$)
    )
    .subscribe(userAccount => {
      this.apiData = [];
      this.apiColumns = [];

      this.loggedInUser = userAccount;
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  isCustomerLoggedIn(): boolean {
    return this.loggedInUser.userType === UserType.Customer;
  }

  isEmployeeLoggedIn(): boolean {
    return this.loggedInUser.userType === UserType.Employee;
  }

  customerLogin() {
    this._msalService.customerLogin();
  }

  employeeLogin() {
    this._msalService.employeeLogin();
  }

  getOrders() {
    this.apiData.splice(0);
    this.apiColumns.splice(0);

    this._httpClient.get<any>('https://localhost:7271/api/order')
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

  getSuppliers() {
    this.apiData.splice(0);
    this.apiColumns.splice(0);

    this._httpClient.get<any>('https://localhost:7271/api/supplier')
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
    this.apiData.splice(0);
    this.apiColumns.splice(0);

    this._httpClient.get<any>('https://localhost:7271/api/category')
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
    this.apiData.splice(0);
    this.apiColumns.splice(0);

    this._httpClient.post<any>('https://localhost:7271/api/supplier', { CompanyName: 'Angular POST Request Example' })
      .subscribe({
        next: response => {
          this._matSnackBar.open(`Supplier ${response.id} Added`, null, { panelClass: ['notification', 'success'], duration: 3000 });
        },
        // Need this handler otherwise the Angular error handling mechanism will kick in.
        error: error => {
        }
      })
  }
}
