import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Router} from '@angular/router';
import {Category} from '../../../core/models/category';
import {AlertMessage, TypeAlert} from '../../../core/models/alert-message';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
    term = '';
    categories: Category[] = [];
    searchedCategories: Category[] = [];
    pagers = [];
    alertMessage: AlertMessage;
    alertModalMessage: AlertMessage;
    subCategories: Category[];
    modalCategory: Category;
    editCategoryId = -1;
    editSubCategoryId = -1;
    formCategoryEdit: FormGroup;
    formSubCategoryEdit: FormGroup;
    isAddCategoryFormVisible = false;
    categoryTypes = [
        {
            name: 'Parent Category',
            parent: true
        },
        {
            name: 'Category',
            parent: false
        }
    ];

    categoryType: {
        name: string,
        parent: boolean
    };
    private NUMBER_ITEMS_PER_PAGE = 2;
    isAddSubCategoryFormVisible = false;


    constructor(private modalService: NgbModal, private ecommerceService: EcommerceService, private router: Router) {
    }


    get fce() {
        return this.formCategoryEdit.controls;
    }

    get fsce() {
        return this.formSubCategoryEdit.controls;
    }


    ngOnInit() {
        this.breadCrumbItems = [{label: 'Ecommerce'}, {label: 'Orders', active: true}];

        this.init();
    }

    init() {
        this.ecommerceService.findAllCategories().subscribe(categories => {
            if (categories != null && categories.length > 0) {
                this.categories = categories;

                this.searchedCategories = this.categories.slice();
                this.pagers = Array(Math.ceil(this.categories.length / this.NUMBER_ITEMS_PER_PAGE)).fill(1);
            }
        });

        this.formCategoryEdit = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            parent: new FormControl(this.categoryType, [Validators.required])
        });
        this.formSubCategoryEdit = new FormGroup({
            name: new FormControl(null, [Validators.required]),
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
            this.ecommerceService.findCategoryById(this.modalCategory.id).subscribe(categoryRes => {
                this.subCategories = categoryRes.subCategories;
                this.modalService.open(content, {centered: true});
                console.log(this.subCategories);
            });
        }
    }

    onDeleteCategory(id: number) {
        console.log('onDeleteCategory', id);
        this.ecommerceService.deleteCategoryById(id).subscribe(value => {
            if (value > 0) {
                this.alertMessage = new AlertMessage();
                this.alertMessage.typeAlert = TypeAlert.DELETE;
                this.alertMessage.message = 'Category Deleted Successfully';
                const index = this.categories.findIndex(category => category.id === id);
                console.log('index', index);
                this.categories.splice(index, 1);
                this.searchedCategories = this.categories.slice();
                setTimeout(() => {
                    this.alertMessage = null;
                }, 8000);
            }
        });
    }

    onEditCategory(category: Category) {

        if (category.parent) {
            this.categoryType = this.categoryTypes[0];
        } else {
            this.categoryType = this.categoryTypes[1];
        }
        this.editCategoryId = category.id;

        this.formCategoryEdit.setValue({
            name: category.name,
            parent: this.categoryType
        });
    }

    onEditSubCategory(category: Category) {

        this.editSubCategoryId = category.id;

        this.formSubCategoryEdit.setValue({
            name: category.name,
        });
    }

    onDeleteSubCategory(id: number) {
        this.ecommerceService.deleteCategoryById(id).subscribe(value => {
            if (value > 0) {
                this.alertModalMessage = new AlertMessage();
                this.alertModalMessage.message = 'Category Deleted Successfully';
                this.alertModalMessage.typeAlert = TypeAlert.DELETE;
                const indexSubCategory = this.subCategories.findIndex(category => category.id === id);
                const indexCategory = this.categories.findIndex(category => category.id === id);
                this.subCategories.splice(indexSubCategory, 1);
                this.categories.splice(indexCategory, 1);
                this.searchedCategories = this.categories.slice();

                setTimeout(() => {
                    this.alertModalMessage = null;
                }, 8000);
            }
        });
    }


    onModalClose() {
        this.modalService.dismissAll();
        this.alertModalMessage = null;
    }

    onSaveEditCategory(category: Category, index: number) {
        const editedCatgoryName = this.fce.name.value;
        const editedCatgoryType: {
            name: string,
            parent: boolean
        } = this.fce.parent.value;
        const editedCategoryIsParent = editedCatgoryType.parent;


        category.name = editedCatgoryName;
        category.parent = editedCategoryIsParent;

        this.ecommerceService.updateCategory(category.id, category).subscribe(category1 => {
            this.categories[index] = category1;
            this.editCategoryId = -1;
        });
    }

    onSaveEditSubCategory(subCategory: Category, index: number) {
        const editedCatgoryName = this.fsce.name.value;


        subCategory.name = editedCatgoryName;

        this.ecommerceService.updateCategory(subCategory.id, subCategory).subscribe(category => {
            this.categories[index] = category;
            this.searchedCategories = this.categories.slice();
            this.editSubCategoryId = -1;
        });
    }

    onSearch(searchedText: string) {

        // if there is no filter before
        this.searchedCategories = this.categories.slice();

        if (searchedText != null && searchedText.trim() !== '') {
            searchedText = searchedText.toLowerCase();
            this.searchedCategories = this.searchedCategories.filter(category => {
                if (category.name.trim() === '') {
                    return null;
                } else {
                    if (category.name !== null && category.name.toLowerCase().indexOf(searchedText) !== -1) {
                        return category;
                    } else {
                        return null;
                    }
                }
            });
        }

        this.pagers = Array(Math.ceil(this.searchedCategories.length / this.NUMBER_ITEMS_PER_PAGE)).fill(1);


    }

    onAddCategory() {
        const newCatgoryName = this.fce.name.value;
        const newCatgoryType: {
            name: string,
            parent: boolean
        } = this.fce.parent.value;
        const newCategoryIsParent = newCatgoryType.parent;


        const category = new Category();
        category.name = newCatgoryName;
        category.parent = newCategoryIsParent;

        this.ecommerceService.addCategory(category).subscribe(categoryRes => {
            if (categoryRes != null) {
                this.categories.unshift(categoryRes);
                this.searchedCategories = this.categories.slice();
                this.isAddCategoryFormVisible = false;
            }
        });

        this.formCategoryEdit.reset();
    }

    onAddSubCategory() {

    }
}
