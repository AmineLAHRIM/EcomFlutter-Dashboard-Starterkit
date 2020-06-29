import {Injectable} from '@angular/core';
import {Product} from '../../../core/models/product';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductsResolverService implements Resolve<Product[]> {

    constructor(private ecommerceService: EcommerceService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> | Promise<Product[]> | Product[] {
        // automatique subscriped to it
        return this.ecommerceService.findAllProducts().pipe(tap(products => {
            this.ecommerceService.productsChanged.next(products);
        }));
    }

    /*resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        // automatique subscriped to it
        this.productRestService.findAll().subscribe(products => {
            this.ecommerceService.productsChanged.next(products);
        });
        return true;
    }*/
}
