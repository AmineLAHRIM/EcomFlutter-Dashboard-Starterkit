import {SuperCategory} from './super-category';
import {Product} from './product';

export class Category {
    id: number;
    name: string;
    deleted: boolean;
    superCategory: SuperCategory;

    products: Product[];
}