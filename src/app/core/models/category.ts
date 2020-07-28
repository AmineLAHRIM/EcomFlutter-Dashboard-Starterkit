import {Product} from './product';

export class Category {
    id: number;
    name: string;
    deleted: boolean;
    parent: boolean;
    parentCategory: Category;

    products: Product[];
}