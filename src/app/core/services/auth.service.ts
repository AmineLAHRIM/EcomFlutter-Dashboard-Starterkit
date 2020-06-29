import {Injectable} from '@angular/core';
import {UserRestService} from '../../api/user-rest.service';
import {User} from '../models/user';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {UserService} from './user.service';
import {Response} from '../models/response';
import {Message} from '../models/message';

@Injectable({providedIn: 'root'})

export class AuthService {

    private tokenExpirationTimer: any;


    constructor(private userRestService: UserRestService, private userService: UserService) {
    }


    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */

    autoLogin() {
        const user: User = JSON.parse(localStorage.getItem('userData'));
        if (user) {
            //if (user.token) {
            this.userService.userSubject.next(user);
            //this.autologout(user.expirationDate.getTime());
            //}
        }
    }

    autologout(expirationDate: number) {
        const timeOutSeconds = (expirationDate - Date.now());
        //const timeOutSeconds = 10000;
        console.log('timeOutSeconds', timeOutSeconds, this.tokenExpirationTimer);
        if (!this.tokenExpirationTimer) {
            this.tokenExpirationTimer = setTimeout(() => {
                console.log('logout');
                this.logout();
            }, timeOutSeconds);
        }

    }

    login(email: string, password: string, rememberMe: boolean) {
        return this.userRestService.findByEmailAndPassword(email, password).pipe(
            catchError(err => this.handleError(err)),
            tap((res: Response) => {
                this.handleAuth(res.output, rememberMe);
            })
        );
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(username: string, email: string, password: string) {

        const user = new User();
        const token = this.randomToken();
        user.token = token;
        user.username = username;
        user.email = email;
        user.password = password;
        console.log('register', user);

        return this.userRestService.save(user).pipe(
            catchError(err => this.handleError(err)),
            tap((res: Response) => {
                this.handleAuth(res.output);
            })
        );


    }


    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {

    }

    /**
     * Logout the user
     */
    logout() {

    }


    handleAuth(user: User, rememberMe?: boolean) {
        if (user != null) {
            console.log('user=', user);
            //const expirationDate = new Date(new Date().getTime() + Number(expirationIn) * 1000);
            if (rememberMe) {
                localStorage.setItem('userData', JSON.stringify(user));
            }
            this.userService.userSubject.next(user);
            //this.autologout(expirationDate.getTime());
        }
    }


    randomToken(): string {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;\'[]\=-)(*&^%$#@!~`';
        const lengthOfCode = 20;
        let text = '';
        for (let i = 0; i < lengthOfCode; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessages: Message[];
        if (errorRes.error != null) {
            errorMessages = [];
            const errorResponse: Response = errorRes.error;
            errorResponse.errors.forEach(error => {
                errorMessages.push(error);
            });
        }
        return throwError(errorMessages);
    }
}

