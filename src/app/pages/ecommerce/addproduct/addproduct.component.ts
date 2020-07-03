import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Product, Unit} from '../../../core/models/product';
import {Message} from '../../../core/models/message';
import {Category} from '../../../core/models/category';
import {Subject} from 'rxjs';
import {SuperCategory} from '../../../core/models/super-category';
import {ProductCategoryDetail} from '../../../core/models/product-category-detail';
import {Store} from '../../../core/models/store';
import {User} from '../../../core/models/user';
import {UserService} from '../../../core/services/user.service';
import {Upsell} from '../../../core/models/upsell';
import {Tag} from '../../../core/models/tag';
import {NgxDropzoneComponent} from 'ngx-dropzone';

@Component({
    selector: 'app-addproduct',
    templateUrl: './addproduct.component.html',
    styleUrls: ['./addproduct.component.scss']
})

/**
 * Ecommerce add-product component
 */
export class AddproductComponent implements OnInit {

    constructor(private ecommerceService: EcommerceService, private userService: UserService) {
    }

    @ViewChild('dropzone', {static: true}) dropzone: NgxDropzoneComponent;
    // bread crumb items
    breadCrumbItems: Array<{}>;
    formProduct: FormGroup;
    formProductMeta: FormGroup;
    product: Product;
    fpsubmitted = false;
    fpmsubmitted = false;
    isEditMode = false;
    id: number;
    units: Unit[] = [Unit.KG, Unit.G, Unit.MG, Unit.PIECE];
    errors: Message[] = [];

    superCategories = new Subject<SuperCategory[]>();
    selectedSuperCategory: SuperCategory;

    upsells = new Subject<Upsell[]>();

    stores = new Subject<Store[]>();
    selectedStore: Store;

    categories = new Subject<Category[]>();
    selectedCategories: Category[] = [];

    tags = new Subject<Tag[]>();

    user: User;

    ngOnInit() {

        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Add Product', active: true}];

        this.formProduct = new FormGroup({
            title: new FormControl(null, [Validators.required]),
            quantityStock: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$')]),
            pricePromo: new FormControl(null, [this.priceValidators.bind(this)]),
            shippingPrice: new FormControl(null, [this.priceValidators.bind(this)]),
            price: new FormControl(null, [Validators.required, this.priceValidators.bind(this)]),
            unit: new FormControl(null, [Validators.required]),
            superCategory: new FormControl(null),
            category: new FormControl(null),
            upsell: new FormControl(null),
            store: new FormControl(null, [Validators.required])
        });

        this.formProductMeta = new FormGroup({
            metakeywords: new FormControl(null),
            shortDescription: new FormControl(null, [Validators.required]),
            longDescription: new FormControl(null, [Validators.required])
        });

        this.setupSubs();


    }


    get fp() {
        return this.formProduct.controls;
    }

    get fpm() {
        return this.formProductMeta.controls;
    }

    priceValidators(control: FormControl) {
        const regex1 = /^[0-9]+([.][0-9]+)?$/;
        const regex2 = /^\d+([.]\d{1,2})?$/;
        if (control.value == null || control.value === '') {
            return null;
        } else if (!regex1.test(control.value)) {
            return {badFormatPrice: true};
        } else if (control.value > 1000000000) {
            return {bigNumber: true};
        }

        return null;
    }

    productOnSubmit() {
        this.fpsubmitted = true;
        this.errors = [];
        if (this.formProduct.valid) {

            if (!this.isEditMode) {
                this.product = new Product();
            }
            this.product.title = this.fp.title.value;
            this.product.quantityStock = this.fp.quantityStock.value;
            this.product.pricePromo = this.fp.pricePromo.value;
            this.product.price = this.fp.price.value;
            this.product.shippingPrice = this.fp.shippingPrice.value;
            this.product.unit = this.fp.unit.value;
            this.product.store = this.fp.store.value;
            this.product.upsells = this.fp.upsell.value;
            console.log('cat value', this.fp.category.value);
            this.product.productCategoryDetails = [];
            this.selectedCategories = this.fp.category.value;
            if (this.selectedCategories != null) {
                this.selectedCategories.forEach(category => {
                    const productCategoryDetail = new ProductCategoryDetail();
                    productCategoryDetail.category = category;
                    this.product.productCategoryDetails.push(productCategoryDetail);
                });
            }


            console.log('productCategoryDetails', this.product.productCategoryDetails);
            console.log('product', this.product);

            if (!this.isEditMode) {
                // Add product
                this.ecommerceService.addProduct(this.product).subscribe(res => {
                    if (res.output != null) {
                        this.product = res.output;
                        this.id = this.product.id;
                        this.isEditMode = true;
                        console.log('new product', this.product);
                    }
                });
            } else {
                // Update product
                console.log('before updated', this.product);

                this.ecommerceService.updateProduct(this.id, this.product).subscribe(res => {
                    console.log('updated', res.output);
                    if (res.output != null) {
                        this.product = res.output;
                        console.log('new product', this.product);
                    }

                }, error1 => {
                    this.errors = error1;
                });
            }
        } else {
            console.log('it\'s Invalid');
        }
    }

    productOnCancel() {
    }

    metaOnSubmit() {
        this.fpmsubmitted = true;
        this.errors = [];
        console.log('metaOnSubmit');

        if (this.formProductMeta.valid) {
            if (!this.isEditMode) {
                this.product = new Product();
            }
            console.log('formProductMeta valid');

            this.product.tags = this.fpm.metakeywords.value;
            this.product.shortDescription = this.fpm.shortDescription.value;
            this.product.longDescription = this.fpm.longDescription.value;
            console.log('before update', this.product);
            if (!this.isEditMode) {
                this.ecommerceService.addProduct(this.product).subscribe(res => {
                    if (res.output != null) {
                        this.product = res.output;
                        this.id = this.product.id;
                        this.isEditMode = true;
                    }
                });
            } else {
                this.ecommerceService.updateProduct(this.id, this.product).subscribe(res => {
                    if (res.output != null) {
                        this.product = res.output;
                    }
                });
            }
        }
    }

    addTagmeta(value) {
        return {name: value, product: this.product};
    }

    private setupSubs() {

        this.userService.userSubject.subscribe(user => {
            if (user != null) {
                this.user = user;
                console.log('user id', this.user.id);
                this.ecommerceService.findAllSellerByUserId(user.id).subscribe(seller => {
                    this.ecommerceService.findAllStoresBySellerId(seller.id).subscribe(stores => {
                        console.log('seller id', seller.id);
                        this.stores.next(stores);
                    });


                });
            }
        });

        if (!this.isEditMode) {
            // Add Mode
            this.ecommerceService.findAllSuperCategories().subscribe(superCategories => {
                this.superCategories.next(superCategories);
            });
        } else {

            // Edit Mode


        }

    }

    onChangeSuperCategory() {
        this.selectedSuperCategory = this.fp.superCategory.value;

        this.fp.category.reset(null);
        this.categories.next(null);

        this.ecommerceService.findAllCategoriesBySuperCategoryId(this.selectedSuperCategory?.id).subscribe(categories => {
            this.categories.next(categories);
            console.log('categories', categories);
        });
    }


    onChangeStore() {
        this.selectedStore = this.fp.store.value;
        console.log('selectedStore', this.selectedStore);

        this.fp.upsell.reset(null);
        this.upsells.next([]);

        this.ecommerceService.findAllProductByStoreId(this.selectedStore?.id).subscribe(res => {
            if (res.output != null) {
                const upsells = [];
                (res.output as Product[]).forEach(product => {
                    const upsell: Upsell = new Upsell();
                    upsell.upsellProduct = product;
                    upsells.push(upsell);
                });
                this.upsells.next(upsells);
            }
        });
    }


    // DropZone

    public onDrop(files: FileList) {
        console.log('onDrop:', files);
    }

    public onUploadChange(args: any) {
        console.log('onUploadInit:', args);
    }

    public onUploadInit(args: any): void {
        console.log('onUploadInit:', args);
    }

    public onUploadError(args: any): void {
        console.log('onUploadError:', args);
    }

    public onUploadSuccess(args: any): void {
        console.log('onUploadSuccess:', args);
    }

    onUploadAccept(args: any) {
        console.log('onUploadAccept:', args);
    }

    onAddedFile(file: File) {
        console.log('onAddedFile:', file);
       /* this.ecommerceService.uploadFile(file).subscribe(fileObj => {
            if (fileObj != null) {
                console.log('Uploaded ' + fileObj);
            }
        });*/
    }
}
