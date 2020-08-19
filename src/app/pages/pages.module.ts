import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {PagesRoutingModule} from './pages-routing.module';

import {BlankpageComponent} from './blankpage/blankpage.component';
import {ProfileComponent} from './profile/profile.component';
import {UIModule} from '../shared/ui/ui.module';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelSpeed: 0.3
};

@NgModule({
    declarations: [BlankpageComponent, ProfileComponent],
    imports: [
        CommonModule,
        PagesRoutingModule,
        PerfectScrollbarModule,
        UIModule,
        NgbAlertModule,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class PagesModule {
}