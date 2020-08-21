import {Component, OnInit} from '@angular/core';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {UserService} from '../../../core/services/user.service';
import {Store} from '../../../core/models/store';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertMessage, TypeAlert} from '../../../core/models/alert-message';
import {User} from '../../../core/models/user';
import {Seller} from '../../../core/models/seller';
import Swal from 'sweetalert2';
import {FileObj} from '../../../core/models/file-obj';
import {UPLOAD_API_URL} from '../../../../environments/environment';
import {DROPZONE_CONFIG, DropzoneConfigInterface} from 'ngx-dropzone-wrapper';


const config: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: UPLOAD_API_URL,
    maxFilesize: 1,
    acceptedFiles: 'image/jpeg,image/png,image/gif',
    timeout: 180000,
    uploadMultiple: false,
    addRemoveLinks: true,
    dictRemoveFile: ''
};

@Component({
    selector: 'app-shops',
    templateUrl: './stores.component.html',
    styleUrls: ['./stores.component.scss'],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: config
        }
    ]
})

/**
 * Ecommerce Shops component
 */
export class StoresComponent implements OnInit {


    // bread crumb items
    breadCrumbItems: Array<{}>;
    alertMessage: AlertMessage;
    originalStores: Store[] = [];
    stores: Store[] = [];
    colors = ['warning', 'primary', 'danger', 'success', 'info', 'dark'];
    storesColors = [];
    isAddStoreFormVisible = false;
    formStore: FormGroup;
    fssubmitted = false;
    alertModalMessage: AlertMessage;
    user: User;
    seller: Seller;
    progressLogoImage: number;
    uploading = false;
    logoImageUrl: string;
    isEditing = false;
    editedStore: Store;
    imageChanged = false;


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
                this.user = user;
                this.ecommerceService.findSellerByUserId(user.id).subscribe(seller => {
                    if (seller != null) {
                        this.seller = seller;
                        this.ecommerceService.findAllStoresBySellerId(seller.id).subscribe(stores => {
                            this.storesColors = [];
                            stores.forEach(store => {
                                this.storesColors.push(this.generatedRandomColor());
                            });
                            this.originalStores = stores;
                            this.stores = this.originalStores;
                        });
                    }
                });
            }
        });

        this.formStore = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            longDescription: new FormControl(null),
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
        this.logoImageUrl = null;
        this.uploading = false;
        this.isEditing = false;
        this.imageChanged = false;
        this.editedStore = null;
    }

    onAddStore() {
        this.fssubmitted = true;
        this.formStore.reset(this.formStore.value);

        if (this.formStore.valid) {
            const store = new Store();
            store.name = this.fs.name.value;
            store.shortDescription = this.fs.shortDescription.value;
            store.longDescription = this.fs.longDescription.value;
            if (this.logoImageUrl != null && this.logoImageUrl.trim() !== '') {
                store.logoImageUrl = this.logoImageUrl;
            }
            if (this.seller != null) {
                store.seller = this.seller;
                if (this.isEditing) {
                    this.ecommerceService.updateStore(this.editedStore.id, store).subscribe(store1 => {
                        if (store1 != null) {
                            this.alertModalMessage = new AlertMessage();
                            this.alertModalMessage.message = 'Store Edited Successfully';
                            this.alertModalMessage.typeAlert = TypeAlert.EDIT;

                            const index = this.originalStores.findIndex(searchedStore => searchedStore.id === store1.id);
                            this.originalStores[index] = store1;
                            const index2 = this.stores.findIndex(searchedStore => searchedStore.id === store1.id);
                            this.stores[index2] = store1;


                            //this.stores.push(store1);
                            //this.formStoreReset();
                        }
                    });
                } else {
                    this.ecommerceService.addStore(store).subscribe(store1 => {
                        if (store1 != null) {
                            this.alertModalMessage = new AlertMessage();
                            this.alertModalMessage.message = 'Store Added Successfully';
                            this.alertModalMessage.typeAlert = TypeAlert.ADD;
                            this.stores.push(store1);
                            this.editedStore = store1;
                            this.isEditing = true;
                            //this.formStoreReset();
                        }
                    });
                }

            } else {
                this.alertModalMessage = new AlertMessage();
                this.alertModalMessage.message = 'You are not a seller';
                this.alertModalMessage.typeAlert = TypeAlert.DELETE;
            }

        }
    }

    openModal(content: any) {
        this.modalService.open(content, {centered: true});
    }

    onModalClose() {
        this.formStoreReset();
        this.alertModalMessage = null;
        this.modalService.dismissAll();
    }

    onEditStore(content: any, store: Store) {
        this.isEditing = true;
        this.editedStore = store;
        this.formStore.setValue({
            name: store.name,
            shortDescription: store.shortDescription,
            longDescription: store.longDescription,
        });
        this.logoImageUrl = store.logoImageUrl;
        this.modalService.open(content, {centered: true});

    }

    onDeleteStore(id: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#556ee6',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.value) {
                //Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
                this.ecommerceService.deleteStoreById(id).subscribe(value => {
                    if (value > 0) {
                        this.alertMessage = new AlertMessage();
                        this.alertMessage.message = 'Store Deleted Successfully';
                        this.alertMessage.typeAlert = TypeAlert.DELETE;
                        // search for store to delete it
                        const index = this.originalStores.findIndex(store => store.id === id);
                        this.originalStores.splice(index, 1);
                        this.stores = this.originalStores.slice();
                    }
                });
            }
        });

    }

    public onUploadSuccess(args: any): void {
        this.uploading = false;
        const file: FileObj = args[1];
        this.handleUploadImage(file.imageUrl);
        setTimeout(() => {
            args = null;
        }, 2000);
        console.log('onUploadSuccess:', args);
    }

    handleUploadImage(imageUrl: string) {
        this.logoImageUrl = imageUrl;
        this.imageChanged = true;

        console.log('logoImageUrl', this.logoImageUrl);


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
        this.uploading = false;

        console.log('File Removed:', file);

    }


    onUploadProgress(file: any) {
        this.uploading = true;
        this.progressLogoImage = file[1];

    }

    public onUploadError(args: any): void {
        this.uploading = false;

    }

    onAddLogoImage() {
        if (!this.uploading) {
            const dropZone: HTMLElement = document.querySelector('#dropzonestorelogo') as HTMLElement;
            (dropZone.firstChild as HTMLElement).click();
        }

    }

    onRemoveLogoImage() {
        this.logoImageUrl = null;
        this.imageChanged = true;
    }
}

