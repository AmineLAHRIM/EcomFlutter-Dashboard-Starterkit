import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../core/models/user';
import {REST_API_URL} from '../../environments/environment';
import {tap} from 'rxjs/operators';
import {UserService} from '../core/services/user.service';
import {Response} from '../core/models/response';

@Injectable({
    providedIn: 'root'
})


export class UserRestService {

    constructor(private httpClient: HttpClient, private userService: UserService) {
    }

    findByUsername(username: string) {
        return this.httpClient.get<User>(REST_API_URL + '/user/username/' + username);
    }

    findById(id: number) {
        return this.httpClient.get<User>(REST_API_URL + '/user/' + id);
    }

    findAll() {
        return this.httpClient.get<User[]>(REST_API_URL + '/user/').pipe(
            tap(users => {
                this.userService.usersSubject.next(users);
            })
        );
    }

    save(user: User) {
        return this.httpClient.post<Response>(REST_API_URL + '/user/', user);
    }

    findByEmailAndPassword(email: string, password: string) {

        let httpParams = new HttpParams();
        httpParams = httpParams.append('email', email);
        httpParams = httpParams.append('password', password);

        return this.httpClient.get<Response>(REST_API_URL + '/user/login', {
            params: httpParams
        });
    }


}
