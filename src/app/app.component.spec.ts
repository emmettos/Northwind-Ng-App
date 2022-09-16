import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';
import { MSAL_CONFIG, protectedResources } from './auth-config';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MaterialModule,
        MsalModule.forRoot(
          new PublicClientApplication(MSAL_CONFIG),
          {
            interactionType: InteractionType.Redirect,
            authRequest: {
              scopes: protectedResources.todoListApi.scopes
            }
          },
          {
            interactionType: InteractionType.Redirect,
            protectedResourceMap: new Map([
              [
                protectedResources.todoListApi.endpoint, 
                protectedResources.todoListApi.scopes
              ]
            ])
          })
      ],
      declarations: [
        AppComponent,
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Northwind Traders Ltd.'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Northwind Traders Ltd.');
  });
});
