import {Rank} from './rank';
import {Category} from './category';
import {Store} from './store';
import {ProductImage} from './product-image';
import {ProductCategoryDetail} from './product-category-detail';
import {ProductWishListDetail} from './product-wish-list-detail';
import {Upsell} from './upsell';
import {Tag} from './tag';
import {RankStars} from './rank-stars';

export enum Unit {
    KG = 'KG', G = 'G', MG = 'MG', PIECE = 'PIECE'
}

export class Product {


    id: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    price: number;
    pricePromo: number;
    shippingPrice: number;
    quantityStock: number;
    unit: Unit;
    featuredImage: ProductImage;
    deleted: boolean;


    rank: Rank;
    rankStars: RankStars;
    store: Store;

    productCategoryDetails: ProductCategoryDetail[];
    productWishListDetail: ProductWishListDetail[];
    productImages: ProductImage[];
    upsells: Upsell[];
    tags: Tag[];


    categories: Category[];


}
