import {Injectable} from '@angular/core';
import {Product} from '../models/product';
import {BehaviorSubject, throwError} from 'rxjs';
import {ProductImage} from '../models/product-image';
import {Category} from '../models/category';
import {REST_API_URL} from '../../../environments/environment';
import {Response} from '../models/response';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Message} from '../models/message';
import {ProductCategoryDetail} from '../models/product-category-detail';
import {catchError, take, tap} from 'rxjs/operators';
import {SuperCategory} from '../models/super-category';
import {Store} from '../models/store';
import {Seller} from '../models/seller';

@Injectable({
    providedIn: 'root'
})
export class EcommerceService {

    productsChanged = new BehaviorSubject<Product[]>(null);
    productChanged = new BehaviorSubject<Product>(null);

    constructor(private httpClient: HttpClient) {
    }


    // -----------------------Product

    findAllProducts() {
        const url = REST_API_URL + '/product/';
        return this.httpClient.get<Product[]>(url);
    }

    findProduct(id: number) {
        const url = REST_API_URL + '/product/' + id;
        return this.httpClient.get<Response>(url).pipe(
            take(1),
            catchError(err => this.handleError(err)),
            tap((res: Response) => res)
        );
    }

    findAllProductByStoreId(id: number) {
        const url = REST_API_URL + '/product/store/' + id;
        return this.httpClient.get<Response>(url).pipe(
            catchError(err => this.handleError(err)),
            tap((res: Response) => res)
        );
    }

    updateProduct(id: number, product: Product) {
        const url = REST_API_URL + '/product/' + id;
        return this.httpClient.put<Response>(url, product).pipe(
            take(1),
            tap(res => res),
            catchError(err => this.handleError(err))
        );
    }

    addProduct(product: Product) {
        const url = REST_API_URL + '/product/';
        return this.httpClient.post<Response>(url, product);
    }

    deleteProductById(id: number) {
        const url = REST_API_URL + '/product/' + id;
        return this.httpClient.delete<number>(url);
    }


    // -----------------------------Product Images

    findAllProductImagesByProductId(id: number) {
        const url = REST_API_URL + '/productimage/productId/' + id;
        return this.httpClient.get<ProductImage[]>(url);
    }

    // -----------------------------Product Category Detail

    findAllProductCategories() {
        const url = REST_API_URL + '/productcategorydetail/';
        return this.httpClient.get<ProductCategoryDetail[]>(url);
    }

    findAllCategoriesByProductId(id: number) {
        const url = REST_API_URL + '/productcategorydetail/productId/' + id;
        return this.httpClient.get<Category[]>(url);
    }

    findAllProductsByCategoryId(id: number) {
        const url = REST_API_URL + '/productcategorydetail/categoryId/' + id;
        return this.httpClient.get<Product[]>(url);
    }


    // -----------------------------Category

    addCategory(category: Category) {
        const url = REST_API_URL + '/category/';
        return this.httpClient.post<number>(url, category);
    }

    findAllCategoriesBySuperCategoryId(id: number) {
        const url = REST_API_URL + '/category/bysupercategoryid/' + id;
        return this.httpClient.get<Category[]>(url);
    }

    findAllCategories() {
        const url = REST_API_URL + '/category/';
        return this.httpClient.get<Category[]>(url);
    }

    findCategoryById(id: number) {
        const url = REST_API_URL + '/category/' + id;
        return this.httpClient.get<Category>(url);
    }

    deleteCategoryById(id: number) {
        const url = REST_API_URL + '/category/' + id;
        return this.httpClient.delete<number>(url);
    }

    // -----------------------------Super Category


    addSuperCategory(superCategory: SuperCategory) {
        const url = REST_API_URL + '/supercategory/';
        return this.httpClient.post<number>(url, superCategory);
    }

    findAllSuperCategories() {
        const url = REST_API_URL + '/supercategory/';
        return this.httpClient.get<SuperCategory[]>(url);
    }

    findSuperCategoryById(id: number) {
        const url = REST_API_URL + '/supercategory/' + id;
        return this.httpClient.get<SuperCategory>(url);
    }

    deleteSuperCategoryById(id: number) {
        const url = REST_API_URL + '/supercategory/' + id;
        return this.httpClient.delete<number>(url);
    }

    // -----------------------------Store

    addStore(store: Store) {
        const url = REST_API_URL + '/store/';
        return this.httpClient.post<number>(url, store);
    }

    findAllStores() {
        const url = REST_API_URL + '/store/';
        return this.httpClient.get<Store[]>(url);
    }

    findStoreById(id: number) {
        const url = REST_API_URL + '/store/' + id;
        return this.httpClient.get<Store>(url);
    }

    findAllStoresBySellerId(id: number) {
        const url = REST_API_URL + '/store/seller/' + id;
        return this.httpClient.get<Store[]>(url);
    }

    deleteStoreById(id: number) {
        const url = REST_API_URL + '/store/' + id;
        return this.httpClient.delete<number>(url);
    }

    // -----------------------------Seller

    addSeller(seller: Seller) {
        const url = REST_API_URL + '/seller/';
        return this.httpClient.post<number>(url, seller);
    }

    findAllSellers() {
        const url = REST_API_URL + '/seller/';
        return this.httpClient.get<Seller[]>(url);
    }

    findSellerById(id: number) {
        const url = REST_API_URL + '/seller/' + id;
        return this.httpClient.get<Seller>(url);
    }

    findAllSellerByUserId(id: number) {
        const url = REST_API_URL + '/seller/user/' + id;
        return this.httpClient.get<Seller>(url);
    }

    deleteSellerById(id: number) {
        const url = REST_API_URL + '/seller/' + id;
        return this.httpClient.delete<number>(url);
    }
    // -----------------------------Upsell



    // -----------------------------handleError

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessages: Message[];
        console.log('ERROR', errorRes.error);
        if (errorRes.error != null) {
            errorMessages = [];
            const errorResponse: Response = errorRes.error;
            errorResponse.errors.forEach(error => {
                errorMessages.push(error);
            });
        }
        return throwError(errorMessages);
    }
}
