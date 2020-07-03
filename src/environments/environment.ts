// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: 'AIzaSyDPCK6MyP6FDkKCPxpPMGNuz8N3vtn34uc',
        authDomain: 'ecomflutter-angular-dashboard.firebaseapp.com',
        databaseURL: 'https://ecomflutter-angular-dashboard.firebaseio.com',
        projectId: 'ecomflutter-angular-dashboard',
        storageBucket: 'ecomflutter-angular-dashboard.appspot.com',
        messagingSenderId: '546835043164',
        appId: '1:546835043164:web:1f9116aea7372b2fdbe799',
        measurementId: 'G-LL1H8H44MS'
    }
};

//export const REST_API_URL = 'http://localhost:8090/ecomflutter';
export const REST_API_URL = 'https://ecomflutter.herokuapp.com';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
