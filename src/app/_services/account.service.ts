import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError,delay} from 'rxjs/operators';
import {ErrorHandlerService} from "./error-handler.service";
import {AccountModel, CreateAccount} from '../_models/account';
import {SingleResponse} from "../_models/response";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  numberChars = new RegExp('[^0-9]', 'g');
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {}

//   getByFunctionCode(obj:ActionRequest) {
//     return this.http
//       .post<any>(`${environment.apiUrl}/admin/action/list`, obj)
//       .pipe(
//         delay(600),
//         data => data
//         ,catchError(this.errorHandler.handleError))
//   }
  getAccountList(obj:any) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/list`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  getLstAllCurrency(){
    return this.http
      .get<any>(`${environment.apiUrl}/account/currency/listAll`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //loại tài khoản
  getLstAccountProduct(){
    return this.http
      .get<any>(`${environment.apiUrl}/account/accountProduct/listAll`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  //mã tài khoản
  getLstAccountClass(){
    return this.http
      .get<any>(`${environment.apiUrl}/account/accountClass/listAll`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  // số dư tối thiểu
  getAccountMinBal(){
    return this.http
      .get<any>(`${environment.apiUrl}/account/accountMinBal/listAll`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  createAccount(obj:CreateAccount){
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/create`,obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  getDetailAccount(obj: any) {
    return this.http
      .post<SingleResponse>(`${environment.apiUrl}/account/account/detail`, obj)
      .pipe(catchError(this.errorHandler.handleError))
  }
  updateAccount(obj: AccountModel) {
    return this.http
      .post<SingleResponse>(`${environment.apiUrl}/account/account/update`, obj)
      .pipe(catchError(this.errorHandler.handleError))
  }
  deleteAccount(obj: any) {
    return this.http
      .post<SingleResponse>(`${environment.apiUrl}/account/account/delete`, obj)
      .pipe(catchError(this.errorHandler.handleError))
  }
  minBalanceBuilder(val: string) {
    if (typeof(val) === 'string') {
      return `${Number(val.replace(this.numberChars, ''))}`
    } else {
      return `${val}`
    }
  }

}
