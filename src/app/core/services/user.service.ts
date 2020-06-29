import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    usersSubject = new BehaviorSubject<User[]>(null);
    userSubject = new BehaviorSubject<User>(null);

    constructor() {
    }


}
