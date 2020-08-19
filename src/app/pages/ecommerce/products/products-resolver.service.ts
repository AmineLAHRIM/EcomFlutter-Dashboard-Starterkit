import {Injectable} from '@angular/core';
import {Product} from '../../../core/models/product';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {RankStarsService} from '../../../core/services/rank-stars.service';

@Injectable({
    providedIn: 'root'
})
export class ProductsResolverService implements Resolve<Product[]> {

    constructor(private ecommerceService: EcommerceService, private rankStarsService: RankStarsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> | Promise<Product[]> | Product[] {
        // automatique subscriped to it
        const storeId = route.params.storeId;
        if (storeId != null) {
            return this.ecommerceService.findAllProductByStoreId(storeId).pipe(map(res => {
                    const products = res.output;
                    products.map(product => {
                        this.rankStarsService.setupRank(product);
                    });
                    return products;
                }),
                tap(products => {
                    this.ecommerceService.productsChanged.next(products);
                }));
        }
        return this.ecommerceService.findAllProducts().pipe(map(products => {
                products.map(product => {
                    this.rankStarsService.setupRank(product);
                });
                return products;
            }),
            tap(products => {
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
