import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlerService} from './error-handler.service';
import {Response, ResponseStatus} from '../_models/response';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoOwnerAccountService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  create(obj) {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/co-owner`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }

  detail(accountId: string) {
    return this.http
      .get<ResponseStatus>(`${environment.apiUrl}/account/co-owner/${accountId}`)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }

  update(customerId: string, obj: any) {
    return this.http
      .put<Response>(`${environment.apiUrl}/process/customer/${customerId}`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }

  list(accountId: string) {
    return this.http
      .get<Response>(`${environment.apiUrl}/account/co-owner/${accountId}/list`)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }

  delete(accountId: string) {
    return this.http
      .delete<Response>(`${environment.apiUrl}/account/co-owner/${accountId}`)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }

}
