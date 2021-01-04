import { Auth, AuthDev } from '@cosmotech/core'
import { AuthMSAL, AuthStaticWebApp } from '@cosmotech/azure'

// AuthMSAL configuration
// authority: 'https://login.microsoftonline.com/1fcfc752-2be8-42b2-be24-0f1bb2ef2164/',
// scopes: ['user.read']
const msalConfig = {
  loginRequest: {
    scopes: ['openid', 'profile']
  },
  accessRequest: {
    scopes: ['https://cosmotechweb.onmicrosoft.com/cosmo_sample/cosmoplatform']
  },
  msalConfig: {
    auth: {
      clientId: '3ae79982-a3dd-471b-9a9e-268b4ff0d5a6',
      redirectUri: window.location.protocol + '//' + window.location.host + '/digitaltwin',
      authority: 'https://cosmotechweb.b2clogin.com/tfp/cosmotechweb.onmicrosoft.com/B2C_1_SignUp_SignIn',
      knownAuthorities: ['https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_SignUp_SignIn', 'https://login.microsoftonline.com']
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  },
  b2cPolicies: {
    names: {
      signUpSignIn: 'B2C_1_SignUp_SignIn',
      forgotPassword: 'B2C_1_ResetPassword',
      editProfile: 'B2C_1_EditProfile'
    },
    authorities: {
      signUpSignIn: {
        authority: 'https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_SignUp_SignIn'
      },
      forgotPassword: {
        authority: 'https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_ResetPassword'
      },
      editProfile: {
        authority: 'https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_EditProfile'
      }
    }
  }
}

// Register the providers used in the application
Auth.addProvider(AuthDev)
Auth.addProvider(AuthStaticWebApp)
Auth.addProvider(AuthMSAL).setConfig(msalConfig)
