import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
//import { WebapiComponent } from './webapi/webapi.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard]
  },
  // {
  //   path: 'webapi',
  //   component: WebapiComponent,
  //   canActivate: [MsalGuard]
  // },
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