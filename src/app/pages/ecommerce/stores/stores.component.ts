import {Component, OnInit} from '@angular/core';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {UserService} from '../../../core/services/user.service';
import {Store} from '../../../core/models/store';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertMessage, TypeAlert} from '../../../core/models/alert-message';


@Component({
    selector: 'app-shops',
    templateUrl: './stores.component.html',
    styleUrls: ['./stores.component.scss']
})

/**
 * Ecommerce Shops component
 */
export class StoresComponent implements OnInit {


    // bread crumb items
    breadCrumbItems: Array<{}>;
    originalStores: Store[] = [];
    stores: Store[] = [];
    colors = ['warning', 'primary', 'danger', 'success', 'info', 'dark'];
    storesColors = [];
    isAddStoreFormVisible = false;
    formStore: FormGroup;
    fssubmitted = false;
    alertModalMessage: AlertMessage;

    constructor(private modalService: NgbModal, private ecommerceService: EcommerceService, private userService: UserService) {
    }

    ngOnInit() {
        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Stores', active: true}];


        this.init();
        /**
         * fetches data
         */
    }

    private init() {
        this.userService.userSubject.subscribe(user => {
            if (user != null) {
                this.ecommerceService.findAllSellerByUserId(user.id).subscribe(seller => {
                    this.ecommerceService.findAllStoresBySellerId(seller.id).subscribe(stores => {
                        this.storesColors = [];
                        stores.forEach(store => {
                            this.storesColors.push(this.generatedRandomColor());
                        });
                        this.originalStores = stores;
                        this.stores = this.originalStores;
                    });
                });
            }
        });

        this.formStore = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            longDescription: new FormControl(null, [Validators.required]),
            shortDescription: new FormControl(null, [Validators.required])
        });
    }

    get fs() {
        return this.formStore.controls;
    }


    generatedRandomColor() {
        const min = 0;
        const max = this.colors.length;
        const randomNumber = Math.floor(Math.random() * (max - min) + min);
        return this.colors[randomNumber];
    }

    onCancelStore() {

    }

    onSearch(searchedText: string) {

        // if there is no filter before
        this.stores = this.originalStores.slice();

        if (searchedText != null && searchedText.trim() !== '') {
            searchedText = searchedText.toLowerCase();
            this.stores = this.stores.filter(store => {
                if (store.name.trim() === '') {
                    return null;
                } else {
                    if (store.name !== null && store.name.toLowerCase().indexOf(searchedText) !== -1) {
                        return store;
                    } else {
                        return null;
                    }
                }
            });
        }


    }

    formStoreReset() {
        this.fssubmitted = false;
        this.formStore.reset();
    }

    onAddStore() {
        this.fssubmitted=true;
        this.alertModalMessage = new AlertMessage();
        this.alertModalMessage.message = 'Store Added Successfully';
        this.alertModalMessage.typeAlert = TypeAlert.ADD;
    }

    openModal(content: any) {
        this.modalService.open(content, {centered: true});
    }

    onModalClose() {
        this.modalService.dismissAll();
    }
}

