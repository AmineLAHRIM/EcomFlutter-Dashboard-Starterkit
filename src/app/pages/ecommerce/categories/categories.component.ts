import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Router} from '@angular/router';
import {Category} from '../../../core/models/category';
import {AlertMessage} from '../../../core/models/alert-message';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})

/**
 * Ecommerce orders component
 */
export class CategoriesComponent implements OnInit {

    // bread crumb items
    breadCrumbItems: Array<{}>;
    term: any;
    categories: Category[] = [];
    typemessage: string;
    message: string;
    modalTypeMessage: string;
    modalMessage: string;
    subCategories: Category[];
    modalCategory: Category;

    constructor(private modalService: NgbModal, private ecommerceService: EcommerceService, private router: Router) {
    }

    ngOnInit() {
        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Orders', active: true}];

        this.init();
    }

    init() {
        this.ecommerceService.findAllCategories().subscribe(categories => {
            if (categories != null && categories.length > 0) {
                this.categories = categories;
            }
        });
    }

    /**
     * Open modal
     * @param content modal content
     */
    openModal(content: any, category: Category) {
        this.modalCategory = category;
        this.subCategories = [];
        if (this.modalCategory.parent) {
            this.subCategories = this.modalCategory.subCategories;
        }
        this.modalService.open(content, {centered: true});
    }

    onDeleteCategory(id: number) {
        console.log('onDeleteCategory', id);
        this.ecommerceService.deleteCategoryById(id).subscribe(value => {
            if (value > 0) {
                this.typemessage = AlertMessage.DELETE;
                this.message = 'Category Deleted Successfully';
                const index = this.categories.findIndex(category => category.id === id);
                console.log('index', index);
                this.categories.splice(index, 1);
                setTimeout(() => {
                    this.typemessage = null;
                    this.message = '';
                }, 8000);
            }
        });
    }

    onEditCategory(id: number) {

    }

    onDeleteSubCategory(id: number) {
        this.ecommerceService.deleteCategoryById(id).subscribe(value => {
            if (value > 0) {
                this.modalTypeMessage = AlertMessage.DELETE;
                this.modalMessage = 'Category Deleted Successfully';
                const indexSubCategory = this.subCategories.findIndex(category => category.id === id);
                const indexCategory = this.categories.findIndex(category => category.id === id);
                this.subCategories.splice(indexSubCategory, 1);
                this.categories.splice(indexCategory, 1);
                setTimeout(() => {
                    this.modalTypeMessage = null;
                    this.modalMessage = '';
                }, 8000);
            }
        });
    }


    onEditSubCategory(id: number) {

    }

    onModalClose() {
        this.modalService.dismissAll();
        this.modalTypeMessage = null;
        this.modalMessage = '';
    }
}
