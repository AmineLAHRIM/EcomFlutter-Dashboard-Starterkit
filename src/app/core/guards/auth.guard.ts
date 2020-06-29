import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService
    ) {
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userService.userSubject.pipe(take(1), map(user => {
            if (user != null) {
                return true;
            }
            // not logged in so redirect to login page with the return url
            return this.router.createUrlTree(['/account/login'], {queryParams: {returnUrl: state.url}});
        }));
    }
}
