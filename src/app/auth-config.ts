import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
 
export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_SIGNUP-SIGNIN",
    editProfile: "b2c_1_edit_profile_v2"
  },
  authorities: {
    signUpSignIn: {
      authority: "https://eosoftwareltd.b2clogin.com/eosoftwareltd.onmicrosoft.com/B2C_1_SIGNUP_SIGNIN",
    },
    editProfile: {
      authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_edit_profile_v2"
    }
  },
  authorityDomain: "eosoftwareltd.b2clogin.com"
};
  
export const MSAL_CONFIG: Configuration = {
  auth: {
    clientId: 'ea6bb630-42e8-415f-84b0-c0ba77de7542',
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: 'http://localhost:4200', 
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: isIE, 
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

export const protectedResources = {
  todoListApi: {
    endpoint: "http://localhost:5000/api/todolist",
    scopes: ["https://eosoftwareltd.onmicrosoft.com/api/tasks.read"],
  },
}

export const loginRequest = {
  scopes: []
};
