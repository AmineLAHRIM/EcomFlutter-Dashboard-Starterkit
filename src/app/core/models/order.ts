import {User} from './user';
import {Invoice} from './invoice';

export class Order {
    public id: number;
    public deleted: boolean;

    public user: User;
    public invoice: Invoice;



}
