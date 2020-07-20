import {Component, OnInit} from '@angular/core';

import {Options} from 'ng5-slider';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Product} from '../../../core/models/product';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertMessage} from '../../../core/models/alert-message';
import {RankStarsService} from '../../../core/services/rank-stars.service';

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
    typemessage: string;
    message: string;

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


        this.route.queryParams.subscribe(params => {
            const typeMessage = params.typeMessage;
            switch (typeMessage) {
                case AlertMessage.DELETE:
                    this.typemessage = AlertMessage.DELETE;
                    this.message = 'Deleted Successfully';
                    break;
                case AlertMessage.EDIT:
                    this.typemessage = AlertMessage.EDIT;
                    this.message = 'Edited Successfully';
                    break;
                case AlertMessage.ADD:
                    this.typemessage = AlertMessage.ADD;
                    this.message = 'Added Successfully';
                    break;
                case AlertMessage.NONE:
                    this.typemessage = null;
                    this.message = '';
                    break;
            }
            this.clearParams();
            setTimeout(() => {
                this.typemessage = null;
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
        console.log('setupFilter');

        this.filtredProducts = this.products.filter(product => {

            // filter price min max
            if (this.productFilters.minPrice !== this.priceoption.floor || this.productFilters.maxPrice !== this.priceoption.ceil) {
                console.log('filter price min max' + this.productFilters.minPrice + this.productFilters.maxPrice);
                if (product.price >= this.productFilters.minPrice && product.price <= this.productFilters.maxPrice) {

                } else {
                    return null;
                }
            }


            // filter rating
            if (this.productFilters.rating > -1) {
                const currentRating = product.rankStars.numbers.length;
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

        console.log('onSearch', this.searchedProducts);
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
