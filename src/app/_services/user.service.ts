import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserInfo } from '../_models/user';
import { environment } from 'src/environments/environment';
import { SearchUser } from '../_models/systemUsers';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { ErrorHandlerService } from "./error-handler.service";
import { Response } from "../_models/response";
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  getAllUsers(user: SearchUser): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/admin/user/list`, user).pipe(
      delay(600),
      map(data => {
        return data
      }, catchError(this.errorHandler.handleError))
    )
  }
  deleteUser(id: any) {
    return this.http.post<any>(`${environment.apiUrl}/admin/user/delete`, id).pipe(
      map(data => {
        return data
      }, catchError(this.errorHandler.handleError))
    )
  }
  lockUser(id: any) {
    return this.http.post<any>(`${environment.apiUrl}/admin/user/lock`, id).pipe(
      map(data => {
        return data
      }, catchError(this.errorHandler.handleError))
    )
  }
  unlockUser(id: any) {
    return this.http.post<any>(`${environment.apiUrl}/admin/user/unlock`, id).pipe(
      map(data => {
        return data
      }, catchError(this.errorHandler.handleError))
    )
  }
  // authentic: removed admin
  getGroupUser() {
    return this.http.get<any[]>(`${environment.apiUrl}/uaa/user/current`);
  }
  getById(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/admin/users/${id}`);
  }
  detail(id: any) {
    return this.http.get<any>(`${environment.apiUrl}/admin/user/detail?id=` + id).pipe(
      map(data => {
        return data
      }, catchError(this.errorHandler.handleError))
    )
  }
  addUser(user: UserInfo) {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/user/insert`, user)
      .pipe(
        map((data) => {
          return data
        }, catchError(this.errorHandler.handleError))
      )
  }
  update(user: UserInfo) {
    return this.http
      .post<Response>(`${environment.apiUrl}/admin/user/update`, user)
      .pipe(
        map((data) => {
          console.log(data);
          return data
        }, catchError(this.errorHandler.handleError))
      )
  }
}
