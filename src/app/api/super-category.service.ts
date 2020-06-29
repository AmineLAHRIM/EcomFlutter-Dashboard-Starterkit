import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {REST_API_URL} from '../../environments/environment';
import {SuperCategory} from '../core/models/super-category';

@Injectable({
    providedIn: 'root'
})
export class SuperCategoryService {

    constructor(private httpClient: HttpClient) {
    }

    findAll() {
        const url = REST_API_URL + '/supercategory/';
        return this.httpClient.get<SuperCategory[]>(url);
    }

    findById(id: number) {
        const url = REST_API_URL + '/supercategory/' + id;
        return this.httpClient.get<SuperCategory>(url);
    }

    deleteById(id: number) {
        const url = REST_API_URL + '/supercategory/' + id;
        return this.httpClient.delete<number>(url);
    }


    add(superCategory: SuperCategory) {
        const url = REST_API_URL + '/supercategory/';
        return this.httpClient.post<number>(url, superCategory);
    }
}
