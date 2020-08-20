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
        this.userSubject.subscribe(user => {
            if (user != null) {
                const stockedUser: User = JSON.parse(localStorage.getItem('userData'));

                if (stockedUser != null) {
                    this.handleLocalStorageUser(user, true);
                } else {
                    this.handleLocalStorageUser(user, false);
                }
            }
        });
    }

    handleLocalStorageUser(user: User, rememberMe?: boolean) {
        if (user != null) {
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(user));
            }
        }
    }


}
