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
import {Store} from '../models/store';
import {Seller} from '../models/seller';
import {FileObj} from '../models/file-obj';
import {UPLOAD_API_URL} from '../../../environments/environment.prod';

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

    findMaxMinPrice() {
        const url = REST_API_URL + '/product/maxminprice';
        return this.httpClient.get<{ maxPrice: number, minPrice: number }>(url);
    }

    // -----------------------------Product Images

    findAllProductImagesByProductId(id: number) {
        const url = REST_API_URL + '/productimage/productId/' + id;
        return this.httpClient.get<ProductImage[]>(url);
    }

    addProductImage(prodcutImage: ProductImage) {
        const url = REST_API_URL + '/productimage/';
        return this.httpClient.post<ProductImage>(url, prodcutImage);
    }

    deleteProductImageById(id: number) {
        const url = REST_API_URL + '/productimage/' + id;
        return this.httpClient.delete<number>(url);
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
        return this.httpClient.post<Category>(url, category);
    }

    findAllCategoriesByParentCategoryId(id: number) {
        const url = REST_API_URL + '/category/byparentcategoryid/' + id;
        return this.httpClient.get<Category[]>(url);
    }

    findAllCategories() {
        const url = REST_API_URL + '/category/';
        return this.httpClient.get<Category[]>(url);
    }

    findAllParentCategories() {
        const url = REST_API_URL + '/parent/';
        return this.httpClient.get<Category[]>(url);
    }

    findCategoryById(id: number) {
        const url = REST_API_URL + '/category/' + id;
        return this.httpClient.get<Category>(url);
    }

    updateCategory(id: number, category: Category) {
        const url = REST_API_URL + '/category/' + id;
        return this.httpClient.put<Category>(url, category);
    }


    deleteCategoryById(id: number) {
        const url = REST_API_URL + '/category/' + id;
        console.log('deleteCategoryById', url);
        return this.httpClient.delete<number>(url);
    }


    // -----------------------------Store

    addStore(store: Store) {
        const url = REST_API_URL + '/store/';
        return this.httpClient.post<Store>(url, store);
    }

    updateStore(id: number, store: Store) {
        const url = REST_API_URL + '/store/' + id;
        return this.httpClient.put<Store>(url, store);
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

    findSellerByUserId(id: number) {
        const url = REST_API_URL + '/seller/user/' + id;
        return this.httpClient.get<Seller>(url);
    }

    deleteSellerById(id: number) {
        const url = REST_API_URL + '/seller/' + id;
        return this.httpClient.delete<number>(url);
    }


    // -----------------------------Upsell


    // -----------------------------File

    uploadFile(file: File) {
        const url = UPLOAD_API_URL;
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.httpClient.post<FileObj>(url, formData);
    }

    downloadFile(url: string) {
        return this.httpClient.get<ArrayBuffer>(url).pipe(tap(x => {
            console.log('x', x);
        }));
    }

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
