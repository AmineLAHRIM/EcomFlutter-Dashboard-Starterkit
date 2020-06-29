import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Product} from '../../../core/models/product';
import {Subject, Subscription} from 'rxjs';
import {ProductImage} from '../../../core/models/product-image';
import {Rank} from '../../../core/models/rank';
import {AlertMessage} from '../../../core/models/alert-message';
import {SuperCategory} from '../../../core/models/super-category';
import {Category} from '../../../core/models/category';

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
    rank: Rank;
    numbers = [];
    leftedNumbers = [];
    fraction = 0;
    errors = [];
    product: Product;
    productImages: ProductImage[] = [];

    superCategory: SuperCategory;
    categories = new Subject<Category[]>();

    selectedCategories = [];

    private subs: Subscription[] = [];
    private sub: Subscription;

    constructor(private route: ActivatedRoute, private router: Router, private ecommerceService: EcommerceService) {
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe((params: Params) => {
            this.id = +params.id;
            console.log('hada id=', this.id);

            // after confirm

        });
        this.subs.push(this.sub);
        this.setupSub();

        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Product Detail', active: true}];
    }

    setupRank() {
        if (this.rank != null) {

            const rankSum = this.rank.numberStar1 +
                this.rank.numberStar2 +
                this.rank.numberStar3 +
                this.rank.numberStar4 +
                this.rank.numberStar5;

            let rankAvg = 0;
            if (rankSum !== 0) {
                rankAvg = (this.rank.numberStar1 * 1 +
                    this.rank.numberStar2 * 2 +
                    this.rank.numberStar3 * 3 +
                    this.rank.numberStar4 * 4 +
                    this.rank.numberStar5 * 5) / rankSum;
                const fixednumber = parseInt(rankAvg + '', 0);
                this.numbers = Array(fixednumber).fill(1);
                this.leftedNumbers = Array(5 - fixednumber - 1).fill(1);
                console.log('numbers', this.numbers);
                this.fraction = rankAvg - fixednumber;
                console.log('fraction', this.fraction);

            }
        }


    }


    setupSub() {
        this.sub = this.ecommerceService.findProduct(this.id).subscribe(res => {
            if (res.output != null) {
                console.log('before hahoma category', this.selectedCategories);
                this.product = res.output;
                this.superCategory = this.product.categories[0]?.superCategory;
                this.categories.next(this.product.categories);
                this.selectedCategories = this.product.categories;
                console.log('hahoma category', this.selectedCategories);

                // setup rank
                this.rank = this.product.rank;
                this.setupRank();
                console.log('hada product=', this.product);
            }
        }, error1 => {
            this.errors = error1;
            // console.log('router 404');
            // this.router.navigate(['pages', '404']);
        });

        this.subs.push(this.sub);

        this.sub = this.ecommerceService.findAllProductImagesByProductId(this.id).subscribe(productImages => {
            if (productImages != null) {
                this.productImages = productImages;
                console.log('hada product images=', this.product);
            }
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
                    this.router.navigate(['/ecommerce/products'], {queryParams: {typeMessage: AlertMessage.DELETE}});
                }
            });
        }
    }

    editProduct() {

    }

}
