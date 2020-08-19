import {WishList} from './wish-list';

export class User {
    public id: number;
    public cin?: string;
    public phoneNumber?: string;
    public address?: string;
    public token: string;
    public firstname: string;
    public lastname: string;
    public username: string;
    public email: string;
    public password: string;
    public profilImageUrl?: string;
    public deleted?: boolean;

    public wishList?: WishList;


    constructor() {
    }


}
