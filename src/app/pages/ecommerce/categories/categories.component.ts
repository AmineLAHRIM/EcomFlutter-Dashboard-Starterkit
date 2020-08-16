import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EcommerceService} from '../../../core/services/ecommerce.service';
import {Router} from '@angular/router';
import {Category} from '../../../core/models/category';
import {AlertMessage, TypeAlert} from '../../../core/models/alert-message';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None
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
    parentCategories: Category[];
    modalCategory: Category;
    editCategoryId = -1;
    editSubCategoryId = -1;
    formCategoryEdit: FormGroup;
    formSubCategoryEdit: FormGroup;
    isAddCategoryFormVisible = false;
    fceSubmitted = false;
    fsceSubmitted = false;

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
    isCategorySelected = false;
    isEditCategorySelected = false;
    isCategoryModal = false;


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
            parent: new FormControl(null, [Validators.required]),
            parentCategory: new FormControl(null, null)
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
        this.isCategoryModal = false;
        if (this.modalCategory.parent) {
            this.ecommerceService.findAllCategoriesByParentCategoryId(this.modalCategory.id).subscribe(subCategories => {
                this.subCategories = subCategories;
                this.modalService.open(content, {centered: true});
                console.log(this.subCategories);
            });
        } else {
            this.isCategoryModal = true;
            this.modalService.open(content, {centered: true});
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

        this.formCategoryEdit.patchValue({
            name: category.name,
            parent: this.categoryType
        });

        if (!category.parent) {
            this.parentCategories = this.searchedCategories.filter(category1 => category1.parent === true);
            if (category.parentCategory != null) {
                this.formCategoryEdit.patchValue({
                    parentCategory: category.parentCategory
                });
            }
            this.isEditCategorySelected = true;
        }
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
        this.formSubCategoryEditReset();
    }

    onSaveEditCategory(category: Category, index: number) {
        this.fceSubmitted = true;
        if (this.formCategoryEdit.valid) {
            this.fceSubmitted = false;
            const editedCatgoryName = this.fce.name.value;
            const editedCatgoryType: {
                name: string,
                parent: boolean
            } = this.fce.parent.value;
            const editedCategoryIsParent = editedCatgoryType.parent;
            const editedCategoryParent = this.fce.parentCategory.value;

            category.name = editedCatgoryName;
            category.parent = editedCategoryIsParent;
            if (editedCategoryParent != null) {
                category.parentCategory = editedCategoryParent;
            } else {
                category.parentCategory = null;
            }

            this.ecommerceService.updateCategory(category.id, category).subscribe(category1 => {
                this.categories[index] = category1;

                this.formCategoryEditReset();
            });


        }

    }

    private formCategoryEditReset() {
        this.editCategoryId = -1;
        this.formCategoryEdit.reset();
        // for Edit
        this.isEditCategorySelected = false;
        // for Add
        this.isCategorySelected = false;
        this.isAddCategoryFormVisible = false;

        this.fceSubmitted = false;
    }

    private formSubCategoryEditReset() {
        this.editSubCategoryId = -1;
        this.fsceSubmitted = false;
        this.formSubCategoryEdit.reset();
    }

    onSaveEditSubCategory(subCategory: Category, index: number) {
        this.fsceSubmitted = true;
        if (this.formSubCategoryEdit.valid) {
            this.fsceSubmitted = false;
            const editedCatgoryName = this.fsce.name.value;


            subCategory.name = editedCatgoryName;


            this.ecommerceService.updateCategory(subCategory.id, subCategory).subscribe(category => {
                this.categories[index] = category;
                this.searchedCategories = this.categories.slice();
                this.formSubCategoryEditReset();
            });


        }
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
        this.fceSubmitted = true;

        console.log('bjoj', this.fceSubmitted, this.fce.parent.errors);
        if (this.formCategoryEdit.valid) {
            this.fceSubmitted = false;

            const newCatgoryName = this.fce.name.value;
            const newCatgoryType: {
                name: string,
                parent: boolean
            } = this.fce.parent.value;
            const newCategoryIsParent = newCatgoryType.parent;
            const newCategoryParent: Category = this.fce.parentCategory.value;


            const category = new Category();
            category.name = newCatgoryName;
            category.parent = newCategoryIsParent;
            if (newCategoryParent != null) {
                category.parentCategory = newCategoryParent;
            } else {
                category.parentCategory = null;
            }

            this.ecommerceService.addCategory(category).subscribe(categoryRes => {
                if (categoryRes != null) {
                    this.categories.unshift(categoryRes);
                    this.searchedCategories = this.categories.slice();
                    this.formCategoryEditReset();
                }
            });
        }

    }

    onAddSubCategory() {

    }

    onCancelCategory() {
        this.formCategoryEditReset();
    }

    onCancelSubCategory(){
        this.formSubCategoryEditReset();
    }


    onChangeCategoryType(isEdit?: boolean) {
        const catgoryType: {
            name: string,
            parent: boolean
        } = this.fce.parent.value;

        if (isEdit) {
            this.isEditCategorySelected = false;
        } else {
            this.isCategorySelected = false;
        }


        if (!catgoryType.parent) {
            if (isEdit) {
                this.isEditCategorySelected = true;
            } else {
                this.isCategorySelected = true;
            }
            this.parentCategories = this.searchedCategories.filter(category => category.parent === true);
        }
    }


}
