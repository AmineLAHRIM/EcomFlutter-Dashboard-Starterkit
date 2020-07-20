import {Product} from './product';

export class Category {
    id: number;
    name: string;
    deleted: boolean;
    parent: boolean;
    subCategories: Category[];

    products: Product[];
}