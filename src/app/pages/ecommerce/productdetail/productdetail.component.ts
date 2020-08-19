import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Product} from '../../../core/models/product';
import {Subject, Subscription} from 'rxjs';
import {ProductImage} from '../../../core/models/product-image';
import {TypeAlert} from '../../../core/models/alert-message';
import {Category} from '../../../core/models/category';
import {Upsell} from '../../../core/models/upsell';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {RankStarsService} from '../../../core/services/rank-stars.service';
import {RoutingStateService} from '../../../core/services/routing-state.service';

@Component({
    selector: 'app-productdetail',
    templateUrl: './productdetail.component.html',
    styleUrls: ['./productdetail.component.scss']
})


/**
 * Ecommerce product-detail component
 */
export class ProductdetailComponent implements OnInit, OnDestroy {

    breadCrumbItems: Array<{}>;
    private id: number;
    errors = [];
    product: Product;
    productImages: ProductImage[] = [];
    relativeUpsells: Upsell[] = [];

    categories = new Subject<Category[]>();
    private previousUrl: string;

    selectedCategories = [];

    private subs: Subscription[] = [];
    private sub: Subscription;


    constructor(private route: ActivatedRoute, private router: Router, private ecommerceService: EcommerceService, private rankStarsService: RankStarsService, private routingStateService: RoutingStateService) {
    }

    ngOnInit() {
        this.previousUrl = this.routingStateService.getPreviousUrl();


        this.sub = this.route.params.subscribe((params: Params) => {
            this.id = +params.id;
            // after confirm
            this.setupSub();

        });
        this.subs.push(this.sub);


        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Product Detail', active: true}];
    }


    setupSub() {
        this.sub = this.ecommerceService.findProduct(this.id).subscribe(res => {
            if (res.output != null) {
                this.product = new Product();

                this.product = res.output as Product;
                this.relativeUpsells = this.product.upsells.slice(0, 3);
                this.relativeUpsells.forEach(upsell => {
                    this.rankStarsService.setupRank(upsell.upsellProduct);
                });
                this.categories.next(this.product.categories);
                this.selectedCategories = this.product.categories;
                if (this.product.productImages != null) {
                    this.productImages = this.product.productImages;

                }

                // setup rank
                this.rankStarsService.setupRank(this.product);

            }
        }, error1 => {
            this.errors = error1;
            // console.log('router 404');
            // this.router.navigate(['pages', '404']);
        });

        this.subs.push(this.sub);


    }

    /**
     * onclick Image show
     * @param event image passed
     */
    imageShow(event) {
        const image = event.target.src;
        const expandImg = document.getElementById('expandedImg') as HTMLImageElement;
        expandImg.src = image;
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    deleteProduct() {
        if (this.product != null) {
            this.ecommerceService.deleteProductById(this.product.id).subscribe(value => {
                if (value >= 0) {
                    this.router.navigate([this.previousUrl], {queryParams: {typeAlert: TypeAlert.DELETE}});
                }
            });
        }
    }

    editProduct() {

    }

}
