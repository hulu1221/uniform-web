import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {ErrorHandlerService} from "./error-handler.service";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    httpLogin: HttpClient;
    constructor(private http: HttpClient,
                private handle: HttpBackend,
                private router: Router,
                private errorHandler: ErrorHandlerService,) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.httpLogin = new HttpClient(handle);
    }
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    getUserByUserName(userName:any):Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/uaa/user/userRole/` + userName).pipe(
          map(data =>{
               return data
          },catchError(this.errorHandler.handleError))
       )
      }
    // authentic: removed admin
    login(username: string, password: string) {
       let reqH = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + 'YnJvd3NlcjoxMjM0',
        });
        let grant_type = 'password'
        let formData = new HttpParams().append("username", username).append("password", password).append("grant_type", grant_type);
        return this.httpLogin.post<any>(`${environment.apiUrl}/uaa/oauth/token`, formData, {headers: reqH})
            .pipe(
                map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    // document.cookie = 'cookieId=' + user.access_token
                    // localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }),catchError(this.errorHandler.handleError)
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('objBreadcrumb');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('function');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('action');
        localStorage.removeItem('index');
        localStorage.removeItem('role');
        sessionStorage.removeItem('flag')
        // this.currentUserSubject.next(null);
        this.router.navigate(['./login']);

    }
}
