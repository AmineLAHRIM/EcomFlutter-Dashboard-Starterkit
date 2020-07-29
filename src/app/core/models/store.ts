import {Seller} from './seller';

export class Store {
    public id: number;

    public name: string;
    public shortDescription: string;
    public longDescription: string;
    public logoImageUrl: string;
    public deleted: boolean;
    public productsCount: number;

    public seller: Seller;


}
