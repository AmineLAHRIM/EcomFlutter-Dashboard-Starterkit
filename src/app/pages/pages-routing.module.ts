import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BlankpageComponent} from './blankpage/blankpage.component';
import {AuthGuard} from '../core/guards/auth.guard';
import {ProfileComponent} from './profile/profile.component';
import {PasswordComponent} from './profile/password/password.component';

const routes: Routes = [
    {path: '', redirectTo: 'default'},
    {path: 'default', component: BlankpageComponent},
    {path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)},
    {path: 'profile', component: ProfileComponent},
    {path: 'profile/password', component: PasswordComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
