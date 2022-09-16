import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { MSAL_CONFIG, protectedResources } from '../auth-config';
import { MaterialModule } from '../material.module';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
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
        HomeComponent 
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
