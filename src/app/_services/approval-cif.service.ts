import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {Response, ResponseStatus} from "../_models/response";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {ApprovableProcess} from "../_models/process";

@Injectable({
  providedIn: 'root'
})
export class ApprovalCifService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }

  approval(integratedId: string) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/approveOne`, {integratedId})
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  sendApprove(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/sendApprove`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  approvalAll(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/approveAll`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  refuse(approvableProcess: ApprovableProcess) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/refuseCif`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  approverClose(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/approverClose`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  inputterClose(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/inputterClose`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  getRegistrableServiceList(processId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/listIntegrated`, { id: processId })
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  sendModify(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/sendModify`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
  sendReject(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/sendReject`, approvableProcess)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))
  }
}
