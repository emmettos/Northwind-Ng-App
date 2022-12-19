import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './_components/home/home.component';
import { ProfileComponent } from './_components/profile/profile.component';
//import { WebapiComponent } from './webapi/webapi.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation:'enabledNonBlocking'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }