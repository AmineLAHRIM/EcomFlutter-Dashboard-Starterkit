import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';

import {initFirebaseBackend} from './authUtils';
import {environment} from '../environments/environment';

import {LayoutsModule} from './layouts/layouts.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {ExtrapagesModule} from './extrapages/extrapages.module';

initFirebaseBackend(environment.firebaseConfig);

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        LayoutsModule,
        HttpClientModule,
        AppRoutingModule,
        ExtrapagesModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
