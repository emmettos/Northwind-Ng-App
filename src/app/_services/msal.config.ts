import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

import { environment } from '../../environments/environment';


// export const b2cPolicies = {
//   authorities: {
//     signUpSignIn: {
//       authority: 'https://eosoftwareltd.b2clogin.com/eosoftwareltd.onmicrosoft.com/B2C_1_SIGNUP_SIGNIN',
//     },
//     editProfile: {
//       authority: 'https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_edit_profile_v2'
//     }
//   },
//   authorityDomain: 'eosoftwareltd.b2clogin.com'
// };
  
const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: '',
    redirectUri: environment.msalConfig.redirectUrl 
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
    loggerOptions: {
      // loggerCallback: (logLevel, message, containsPii) => {
      //   console.log(message);
      // },
      logLevel: LogLevel.Trace,
      piiLoggingEnabled: true
    }
  }
}

export const MSAL_ADB2C_CLIENT_ID = 'ea6bb630-42e8-415f-84b0-c0ba77de7542';
export const MSAL_AD_CLIENT_ID = 'd0bd9428-6816-4247-9230-611c186b5911';

export const MSAL_ADB2C_APP_ROLES_SCOPE = 'https://eosoftwareltd.onmicrosoft.com/ea6bb630-42e8-415f-84b0-c0ba77de7542/access_via_approle_assignments';
export const MSAL_AD_APP_ROLES_SCOPE = 'api://d0bd9428-6816-4247-9230-611c186b5911/access_via_approle_assignments';

export const MSAL_CONFIG_MAP = new Map<string, Configuration>([
  [
    MSAL_ADB2C_CLIENT_ID, 
    {
      ...MSAL_CONFIG,
      auth: {
        ...MSAL_CONFIG.auth,
        clientId: MSAL_ADB2C_CLIENT_ID,
        authority: 'https://eosoftwareltd.b2clogin.com/eosoftwareltd.onmicrosoft.com/B2C_1_SIGNUP_SIGNIN',
        knownAuthorities: ['eosoftwareltd.b2clogin.com'],
      }
    }
  ],
  [
    MSAL_AD_CLIENT_ID, 
    {
      ...MSAL_CONFIG,
      auth: {
        ...MSAL_CONFIG.auth,
        clientId: MSAL_AD_CLIENT_ID,
        authority: 'https://login.microsoftonline.com/fa760984-8fd7-4684-940e-62c94e616725',
      }
    }
  ],
]);
