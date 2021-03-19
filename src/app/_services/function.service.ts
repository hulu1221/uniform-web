import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, delay} from 'rxjs/operators';
import {ErrorHandlerService} from "./error-handler.service";
import {Response} from "../_models/response";

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  httpOptions = {};
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {}
  getAll() {
    return this.http
      .get<Response>(`${environment.apiUrl}/admin/function/listAll`)
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  getAllFunction(obj:any) {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/function/list`,obj)
      .pipe(delay(2000),
        catchError(this.errorHandler.handleError));
  }

}
