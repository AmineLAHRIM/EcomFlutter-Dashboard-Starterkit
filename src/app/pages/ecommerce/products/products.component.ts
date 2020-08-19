import {Component, OnInit} from '@angular/core';

import {Options} from 'ng5-slider';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Product} from '../../../core/models/product';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertMessage, TypeAlert} from '../../../core/models/alert-message';
import {RankStarsService} from '../../../core/services/rank-stars.service';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})


/**
 * Ecommerce products component
 */
export class ProductsComponent implements OnInit {

    breadCrumbItems: Array<{}>;
    products: Product[] = [];
    filtredProducts: Product[] = [];
    priceoption: Options = {
        floor: 0,
        ceil: 0,
        translate: (value: number): string => {
            return '$' + value;
        },
    };

    customRatingRadioSelected = false;

    radioListDiscount = [
        {discount: 0, label: 'Less than 10%', isChecked: false},
        {discount: 10, label: '10% or more', isChecked: false},
        {discount: 20, label: '20% or more', isChecked: false},
        {discount: 30, label: '30% or more', isChecked: false},
        {discount: 40, label: '40% or more', isChecked: false},
        {discount: 50, label: '50% or more', isChecked: false}
    ];
    radioListRating = [
        {rating: 4, isChecked: false},
        {rating: 3, isChecked: false},
        {rating: 2, isChecked: false},
        {rating: 1, isChecked: false},
    ];

    productFilters = {
        discount: -1,
        rating: -1,
        minPrice: 0,
        maxPrice: 0
    };
    private searchedProducts: Product[];
    alertMessage: AlertMessage;
    private storeId: number;

    constructor(private ecommerceService: EcommerceService, private route: ActivatedRoute, private router: Router, private rankStarsService: RankStarsService) {
    }

    ngOnInit() {

        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Product', active: true}];
        // because data already fetched on reslover before ngOnInit
        // and we can subscribe then fetch data

        this.ecommerceService.productsChanged.subscribe(products => {
            this.products = products;
            this.filtredProducts = this.products.slice();
        });

        this.storeId = this.route.snapshot.params.storeId;
        if (this.storeId != null) {
            this.ecommerceService.findMaxMinPriceByStoreId(this.storeId).subscribe(price => {
                if (price != null) {
                    this.productFilters.maxPrice = price.maxPrice;
                    this.productFilters.minPrice = price.minPrice;
                    this.priceoption = {
                        floor: price.minPrice,
                        ceil: price.maxPrice,
                        translate: (value: number): string => {
                            return '$' + value;
                        }
                    };
                }
            });
        } else {
            this.ecommerceService.findMaxMinPrice().subscribe(price => {
                if (price != null) {
                    this.productFilters.maxPrice = price.maxPrice;
                    this.productFilters.minPrice = price.minPrice;
                    this.priceoption = {
                        floor: price.minPrice,
                        ceil: price.maxPrice,
                        translate: (value: number): string => {
                            return '$' + value;
                        }
                    };
                }
            });
        }


        this.route.queryParams.pipe(take(1)).subscribe(params => {
            const typeAlert = params.typeAlert;
            this.alertMessage = new AlertMessage();
            switch (typeAlert) {
                case TypeAlert.DELETE:
                    this.alertMessage.message = 'Deleted Successfully';
                    this.alertMessage.typeAlert = TypeAlert.DELETE;
                    break;
                case TypeAlert.EDIT:
                    this.alertMessage.message = 'Edited Successfully';
                    this.alertMessage.typeAlert = TypeAlert.EDIT;
                    break;
                case TypeAlert.ADD:
                    this.alertMessage.message = 'Added Successfully';
                    this.alertMessage.typeAlert = TypeAlert.ADD;

                    break;
                case TypeAlert.NONE:
                    this.alertMessage = null;
                    break;
                default:
                    this.alertMessage = null;
                    break;
            }
            this.clearParams();
            setTimeout(() => {
                this.alertMessage = null;
            }, 8000);
        });


    }

    clearParams() {
        this.router.navigate(
            ['.'],
            {relativeTo: this.route}
        );
    }


    customRating(radio: { rating: number, isChecked: boolean }, event: any) {
        if (event.target.checked) {
            radio.isChecked = true;

            this.productFilters.rating = radio.rating;
            this.setupFilter();

        }
    }

    private setupFilter() {

        this.filtredProducts = this.products.filter(product => {

            // filter price min max
            if (this.productFilters.minPrice !== this.priceoption.floor || this.productFilters.maxPrice !== this.priceoption.ceil) {
                let currentProductPrice = product.price;
                if (product.pricePromo !== 0 && product.pricePromo < product.price) {
                    currentProductPrice = product.pricePromo;
                }
                if (currentProductPrice >= this.productFilters.minPrice && currentProductPrice <= this.productFilters.maxPrice) {

                } else {
                    return null;
                }
            }


            // filter rating
            if (this.productFilters.rating > -1) {
                const currentRating = product.rankStars?.numbers.length;
                if (this.productFilters.rating + 1 === RankStarsService.NUMBER_STARS) {
                    if (currentRating >= this.productFilters.rating && currentRating <= this.productFilters.rating + 1) {
                    } else {
                        return null;
                    }

                } else {
                    if (currentRating >= this.productFilters.rating) {
                    } else {
                        return null;
                    }
                }
            }

            // filter discount
            if (this.productFilters.discount > -1) {
                // no discount exist
                if (product.pricePromo === 0) {
                    return null;
                }
                const productDiscount = (100 - (product.pricePromo * 100 / product.price));
                if (this.productFilters.discount === 0) {
                    if (productDiscount >= 10) {
                        return null;
                    }
                } else {
                    if (productDiscount < this.productFilters.discount) {
                        return null;
                    }
                }
            }
            return product;


        });

        this.searchedProducts = this.filtredProducts.slice();


    }

    onResetFilter() {
        this.filtredProducts = this.products.slice();
        this.onResetDiscount(true);
        this.onResetRating(true);
        this.onResetPrice(true);
    }

    onResetRating(isResetAll?: boolean) {
        this.productFilters.rating = -1;
        this.radioListRating.forEach(radio => {
            if (radio.isChecked) {
                radio.isChecked = false;
            }
        });
        if (!isResetAll) {
            this.setupFilter();
        }
    }

    onResetDiscount(isResetAll?: boolean) {
        this.productFilters.discount = -1;
        this.radioListDiscount.forEach(radio => {
            if (radio.isChecked) {
                radio.isChecked = false;
            }
        });
        if (!isResetAll) {
            this.setupFilter();
        }
    }

    onResetPrice(isResetAll?: boolean) {
        this.productFilters.minPrice = this.priceoption.floor;
        this.productFilters.maxPrice = this.priceoption.ceil;
        if (!isResetAll) {
            this.setupFilter();
        }
    }

    onDiscount(radio: { discount: number, label: string, isChecked: boolean }, event: any) {
        if (event.target.checked) {
            radio.isChecked = true;
            this.productFilters.discount = radio.discount;
            this.setupFilter();
        }
    }

    onUserPriceChangeEnd() {
        this.setupFilter();
    }

    onSearch(searchedText: string) {

        // if there is no filter before
        if (this.searchedProducts == null || this.searchedProducts.length === 0) {
            this.searchedProducts = this.products.slice();
        }
        searchedText = searchedText.toLowerCase();
        this.filtredProducts = this.searchedProducts.filter(product => {
            if (product.title.trim() === '') {
                return null;
            } else {
                if (product.title !== null && product.title.toLowerCase().indexOf(searchedText) !== -1) {
                    return product;
                } else if (product.shortDescription !== null && product.shortDescription.toLowerCase().indexOf(searchedText) !== -1) {
                    return product;
                } else if (product.longDescription !== null && product.longDescription.toLowerCase().indexOf(searchedText) !== -1) {
                    return product;
                } else {
                    return null;
                }
            }
        });

    }


}
