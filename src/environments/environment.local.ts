// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const HOME_URL = 'https://localhost:4200';

export const environment = {
  production: false,

  statisticalVizConfig: {
    trainingServiceUrl: 'http://localhost:3000/kypo-rest-training/api/v1/',
  },
  authConfig: {
    guardMainPageRedirect: 'visualization',
    guardLoginPageRedirect: 'login',
    interceptorAllowedUrls: ['https://172.19.0.22', 'http://localhost', 'https://localhost'],
    authorizationStrategyConfig: {
      authorizationUrl: 'https://172.19.0.22/kypo-rest-user-and-group/api/v1/users/info',
    },
    // OIDC SETTINGS
    providers: [
      {
        label: 'Login with MUNI',
        textColor: 'white',
        backgroundColor: '#002776',
        oidcConfig: {
          // Url of the Identity Provider
          issuer: 'https://172.19.0.22:443/csirtmu-dummy-issuer-server/',
          // The SPA's id. The SPA is registered with this id at the config-server
          clientId: '51d53826-3252-4db5-a4a1-51c51588efed',
          // URL of the SPA to redirect the user after silent refresh
          redirectUri: HOME_URL,
          // set the scope for the permissions the client should request
          scope: 'openid email profile',
          logoutUrl: 'https://172.19.0.22/csirtmu-dummy-issuer-server/endsession',
          // URL of the SPA to redirect the user to after login
          postLogoutRedirectUri: HOME_URL,
          clearHashAfterLogin: true,
        },
      },
    ],
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
