// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration production` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {
    VisualizationsDataConcreteService
} from '../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/services/visualizations-data-concrete.service';
import {
    VisualizationsDataService
} from '../../projects/kypo-trainings-clustering-viz-lib/src/lib/visualization/services/visualizations-data.service';

const BASE_URL = 'https://172.19.0.22';
const HOME_URL = 'https://localhost:4200';

export const environment = {
    production: true,
    providers: [
        { provide: VisualizationsDataService, useClass: VisualizationsDataConcreteService }
    ],
    statisticalVizConfig: {
        trainingServiceUrl: BASE_URL + '/kypo-rest-training/api/v1/',
    },
    authConfig: {
        guardMainPageRedirect: 'visualization',
        guardLoginPageRedirect: 'login',
        interceptorAllowedUrls: [
            'https://localhost',
            BASE_URL
        ],
        authorizationStrategyConfig: {
            authorizationUrl: BASE_URL + '/kypo-rest-user-and-group/api/v1/users/info',
        },
        // OIDC SETTINGS
        providers: [
            {
                label: 'Login with local issuer',
                textColor: 'white',
                backgroundColor: '#002776',
                oidcConfig: {
                    requireHttps: true,
                    issuer: BASE_URL + '/keycloak/realms/KYPO',
                    clientId: 'KYPO-client',
                    redirectUri: HOME_URL,
                    scope: 'openid email profile offline_access',
                    logoutUrl: BASE_URL + '/keycloak/realms/KYPO/protocol/openid-connect/logout',
                    silentRefreshRedirectUri: BASE_URL + '/silent-refresh.html',
                    postLogoutRedirectUri: HOME_URL + '/logout-confirmed',
                    clearHashAfterLogin: true
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
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
