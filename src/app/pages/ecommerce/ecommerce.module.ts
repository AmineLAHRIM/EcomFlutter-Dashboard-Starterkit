import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {EcommerceRoutingModule} from './ecommerce-routing.module';
import {UIModule} from '../../shared/ui/ui.module';
import {WidgetModule} from '../../shared/widget/widget.module';

import {Ng5SliderModule} from 'ng5-slider';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgbAlertModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule} from 'ngx-dropzone-wrapper';
import {NgSelectModule} from '@ng-select/ng-select';

import {ProductsComponent} from './products/products.component';
import {ProductdetailComponent} from './productdetail/productdetail.component';
import {ShopsComponent} from './shops/shops.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CartComponent} from './cart/cart.component';
import {AddproductComponent} from './addproduct/addproduct.component';
import {CustomersComponent} from './customers/customers.component';
import {OrdersComponent} from './orders/orders.component';
import {REST_API_URL} from '../../../environments/environment';

const config: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: REST_API_URL + '/file/uploadfile/',
    maxFilesize: 10,
    acceptedFiles: 'image/jpeg,image/png,image/gif'
};

@NgModule({
    // tslint:disable-next-line: max-line-length
    declarations: [ProductsComponent, ProductdetailComponent, ShopsComponent, CheckoutComponent, CartComponent, AddproductComponent, CustomersComponent, OrdersComponent],
    imports: [
        CommonModule,
        EcommerceRoutingModule,
        NgbNavModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgbDropdownModule,
        DropzoneModule,
        UIModule,
        WidgetModule,
        Ng5SliderModule,
        NgSelectModule,
        NgbPaginationModule,
        NgbAlertModule,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: config
        }
    ]
})
export class EcommerceModule {
}
