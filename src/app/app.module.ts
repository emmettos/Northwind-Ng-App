import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AlertComponent } from './_components/alert/alert.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './_components/home/home.component';
import { ProfileComponent } from './_components/profile/profile.component';

import { MsalService } from './_services/msal.service';
import { LogPublishersService } from './_services/log-publishers-service';
import { LogService } from './_services/log.service';
import { HttpInterceptorHelper } from './_helpers/http.interceptor.helper';
import { AlertService } from './_services/alert.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorHelper,
      multi: true
    },
    AlertService,
    LogService,
    LogPublishersService,
    MsalService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
