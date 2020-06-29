import {Component, OnInit} from '@angular/core';

import {Options} from 'ng5-slider';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Product} from '../../../core/models/product';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertMessage} from '../../../core/models/alert-message';

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
    pricevalue = 250;
    minVal = 100;
    maxVal = 800;
    priceoption: Options = {
        floor: 0,
        ceil: 1000,
        translate: (value: number): string => {
            return '$' + value;
        },
    };
    alertMessage: AlertMessage;
    typemessage: string;
    message: string;


    constructor(private ecommerceService: EcommerceService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Product', active: true}];
        // because data already fetched on reslover before ngOnInit
        // and we can subscribe then fetch data

        this.ecommerceService.productsChanged.subscribe(products => {
            this.products = products;
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


}
