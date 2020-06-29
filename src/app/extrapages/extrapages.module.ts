import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExtrapagesRoutingModule} from './extrapages-routing.module';
import {Page404Component} from './page404/page404.component';


@NgModule({
    // tslint:disable-next-line: max-line-length
    declarations: [Page404Component],
    imports: [
        CommonModule,
        ExtrapagesRoutingModule
    ]
})
export class ExtrapagesModule {
}
