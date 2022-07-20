import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { MaterialModule } from '../material.module';
import { MSAL_CONFIG, protectedResources } from '../auth-config';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

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
        ProfileComponent 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
