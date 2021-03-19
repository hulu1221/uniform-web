import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActionRequest} from '../_models/action';
import {catchError, delay} from 'rxjs/operators';
import {ErrorHandlerService} from "./error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {}

  getByFunctionCode(obj:ActionRequest) {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/action/list`, obj)
      .pipe(
        delay(600),
        data => data
        ,catchError(this.errorHandler.handleError))
  }
  getAllAction() {
    return this.http
      .get<any>(`${environment.apiUrl}/admin/action/listAll`, )
      .pipe(catchError(this.errorHandler.handleError));
  }

}
