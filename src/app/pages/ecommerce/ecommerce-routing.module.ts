import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProductsComponent} from './products/products.component';
import {ProductdetailComponent} from './productdetail/productdetail.component';
import {ShopsComponent} from './shops/shops.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CartComponent} from './cart/cart.component';
import {AddproductComponent} from './addproduct/addproduct.component';
import {CustomersComponent} from './customers/customers.component';
import {OrdersComponent} from './orders/orders.component';
import {ProductsResolverService} from './products/products-resolver.service';
import {CategoriesComponent} from './categories/categories.component';

const routes: Routes = [
    {
        path: 'products',
        component: ProductsComponent,
        resolve: [ProductsResolverService]
    },
    {
        path: 'product/:id',
        component: ProductdetailComponent
    },
    {
        path: 'product-detail',
        component: ProductdetailComponent
    },
    {
        path: 'categories',
        component: CategoriesComponent
    },
    {
        path: 'shops',
        component: ShopsComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'add-product',
        component: AddproductComponent
    },
    {
        path: 'add-product/:id',
        component: AddproductComponent
    },
    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {
}
