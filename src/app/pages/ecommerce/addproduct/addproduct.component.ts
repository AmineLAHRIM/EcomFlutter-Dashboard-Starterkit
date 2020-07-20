import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Product, Unit} from '../../../core/models/product';
import {Message} from '../../../core/models/message';
import {Category} from '../../../core/models/category';
import {Subject} from 'rxjs';
import {ProductCategoryDetail} from '../../../core/models/product-category-detail';
import {Store} from '../../../core/models/store';
import {User} from '../../../core/models/user';
import {UserService} from '../../../core/services/user.service';
import {Upsell} from '../../../core/models/upsell';
import {Tag} from '../../../core/models/tag';
import {ProductImage} from '../../../core/models/product-image';
import {ActivatedRoute, Params} from '@angular/router';
import {Response} from '../../../core/models/response';
import {FileObj} from '../../../core/models/file-obj';
import {DomSanitizer} from '@angular/platform-browser';
import {UPLOAD_API_URL} from '../../../../environments/environment';

@Component({
    selector: 'app-addproduct',
    templateUrl: './addproduct.component.html',
    styleUrls: ['./addproduct.component.scss']
})

/**
 * Ecommerce add-product component
 */
export class AddproductComponent implements OnInit {

    constructor(private ecommerceService: EcommerceService, private userService: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    }


    @ViewChild('dropzone', {static: false}) dropzone;
    //@ViewChild(NgxDropzoneComponent, {static: false}) dropzone: NgxDropzoneComponent;
    // bread crumb items
    breadCrumbItems: Array<{}>;
    formProduct: FormGroup;
    formProductMeta: FormGroup;
    product: Product;
    fpsubmitted = false;
    fpmsubmitted = false;
    handleFirstImage = false;
    isEditMode = false;
    id: number;
    units: Unit[] = [Unit.KG, Unit.G, Unit.MG, Unit.PIECE];
    errors: Message[] = [];
    files: File[] = [];

    categories = new Subject<Category[]>();
    selectedCategories: Category[];
    productImages: ProductImage[] = [];
    upsells = new Subject<Upsell[]>();
    dropzoneDisabled = false;
    stores = new Subject<Store[]>();
    selectedStore: Store;
    imageurl = 'https://am1ne.com/public/uploads/2020-07-18T14:33:21.611Z-104382315.jpg';

    tags = new Subject<Tag[]>();

    user: User;

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.id = +params.id;
            this.route.queryParams.subscribe(queryParams => {
                this.isEditMode = queryParams.isEditMode;
                this.init();
            });
        });


        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Add Product', active: true}];


    }

    init() {


        this.formProduct = new FormGroup({
            title: new FormControl(null, [Validators.required]),
            quantityStock: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$')]),
            pricePromo: new FormControl(null, [this.priceValidators.bind(this)]),
            shippingPrice: new FormControl(null, [this.priceValidators.bind(this)]),
            price: new FormControl(null, [Validators.required, this.priceValidators.bind(this)]),
            unit: new FormControl(null, [Validators.required]),
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

    handleUploadImage(imageUrl: string, file: File) {
        this.errors = [];
        console.log('handleUploadImage');

        if (!this.isEditMode) {
            this.product = new Product();
            this.ecommerceService.addProduct(this.product).subscribe(res => {
                if (res.output != null) {
                    this.product = res.output;
                    this.id = this.product.id;
                    this.isEditMode = true;

                    this.addProductImageSub(imageUrl, file);
                }
            });
        } else {
            this.ecommerceService.updateProduct(this.id, this.product).subscribe(res => {
                if (res.output != null) {
                    this.product = res.output;
                    this.addProductImageSub(imageUrl, file);
                }
            });
        }

    }

    private addProductImageSub(imageUrl: string, file: any) {
        const productImage = new ProductImage();
        productImage.product = this.product;
        productImage.imageUrl = imageUrl;
        this.productImages.push(productImage);
        this.ecommerceService.addProductImage(productImage).subscribe(productimage => {
            if (productimage != null) {
                if (!this.handleFirstImage) {
                    this.product.featuredImageUrl = productimage.imageUrl;
                    console.log('Product featured Image Added ' + imageUrl);
                }
                file.id = productimage.id;
                this.handleFirstImage = true;
                console.log('Product Image Added ' + imageUrl);
                console.log('File Image Added ' + file);
            }
        });
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

        this.ecommerceService.findAllCategories().subscribe(categories => {
            this.categories.next(categories);
        });

        if (!this.isEditMode) {
            // Add Mode

        } else {
            // Edit Mode
            this.ecommerceService.findProduct(this.id).subscribe((res: Response) => {
                this.product = new Product();
                this.product = res.output;
                console.log('findProduct', this.product);

                this.formProduct.setValue({
                    title: this.product?.title,
                    quantityStock: this.product?.quantityStock,
                    pricePromo: this.product?.pricePromo,
                    shippingPrice: this.product?.shippingPrice,
                    price: this.product?.price,
                    unit: this.product?.unit,
                    category: this.product?.categories,
                    upsell: this.product?.upsells,
                    store: this.product?.store,
                });

                this.formProductMeta.setValue({
                    metakeywords: this.product?.tags,
                    shortDescription: this.product?.shortDescription,
                    longDescription: this.product?.longDescription
                });

                this.productImages = this.product.productImages.slice();
                /*this.ecommerceService.downloadFile(this.imageurl).subscribe(data => {
                    const file = new File([data], 'sample.jpg');
                    this.files.push(file);
                });*/
                /*let ngEvent: NgxDropzoneChangeEvent;
                Url.createObjectURL().createObjectURL(this.product.productImages[0].imageUrl);
                ngEvent.addedFiles.push(new File());
                this.dropzone.change.emit();*/

            });
        }


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
        const file: FileObj = args[1];
        this.handleUploadImage(file.imageUrl, args[0]);
        console.log('onUploadSuccess:', args);
    }

    onUploadAccept(args: any) {
        console.log('onUploadAccept:', args);
    }

    onAddedFile(file: FileObj) {

        console.log('onAddedFile:', file);
        /* this.ecommerceService.uploadFile(file).subscribe(fileObj => {
             if (fileObj != null) {
                 console.log('Uploaded ' + fileObj);
             }
         });*/
    }

    onRemovedFile(file: any) {
        this.ecommerceService.deleteProductImageById(file.id).subscribe(value => {
            console.log('File Removed:', file);
        });
        console.log('onRemovedFile:', file);
    }

    onCancelFormProduct() {
        if (this.formProduct != null) {
            if (!this.isEditMode) {
                // Add Mode
                this.formProduct.reset();
            } else {
                // Edit Mode
                this.formProduct.reset({
                    title: this.product?.title,
                    quantityStock: this.product?.quantityStock,
                    pricePromo: this.product?.pricePromo,
                    shippingPrice: this.product?.shippingPrice,
                    price: this.product?.price,
                    unit: this.product?.unit,
                    category: this.product?.categories,
                    upsell: this.product?.upsells,
                    store: this.product?.store,
                });

                /* this.ecommerceService.findProduct(this.id).subscribe((res: Response) => {
                     this.product = new Product();
                     this.product = res.output;
                     console.log('findProduct', this.product);




                 });*/
            }
        }
    }

    onCancelFormProductMeta() {
        if (this.formProduct != null) {
            if (!this.isEditMode) {
                // Add Mode
                this.formProductMeta.reset();
            } else {
                this.formProductMeta.reset({
                    metakeywords: this.product?.tags,
                    shortDescription: this.product?.shortDescription,
                    longDescription: this.product?.longDescription
                });
            }
        }
    }


    onDeleteProductImage(productImage: ProductImage) {
        this.ecommerceService.deleteProductImageById(productImage.id).subscribe(value => {
            if (value > 0) {

            }
        });
    }

    onSaveProductImages() {

    }

    onCancelFormProductImages() {

    }
}
