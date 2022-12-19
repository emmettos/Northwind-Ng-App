import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: Claim[] = [];

  constructor() { 
  }

  ngOnInit(): void {
  }

  checkAndSetActiveAccount() {
    // let activeAccount = this.authService.instance.getActiveAccount();

    // if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
    //   let accounts = this.authService.instance.getAllAccounts();
    //   this.authService.instance.setActiveAccount(accounts[0]);
    // }
  }

  getClaims(claims: any) {
    let list: Claim[]  = new Array<Claim>();

    Object.keys(claims).forEach(function(k, v){      
      let c = new Claim();

      c.id = v;
      c.claim = k;
      c.value =  claims ? claims[k]: null;
      
      list.push(c);
    });

    this.dataSource = list;
  }
}

export class Claim {
  id: number;
  claim: string;
  value: string;
}
