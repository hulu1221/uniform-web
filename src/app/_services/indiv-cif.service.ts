import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {CifCondition, IndividualCif} from "../_models/cif";
import {ProcessResponse, Response} from "../_models/response";
import {environment} from "../../environments/environment";
import {catchError, map,delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class IndivCifService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }

  openCif(userCif: IndividualCif) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/openIndivCIF`, userCif)
      .pipe(map(data => {
        return data
      }
      , catchError(this.errorHandler.handleError)))

  }
  updateCif(userCif: IndividualCif) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/updateIndivCIF`, userCif)
      .pipe(map(data => {
          return data
        }
        , catchError(this.errorHandler.handleError)))

  }

  getCifList(condition: CifCondition) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/list`, condition)
      .pipe(map(data => {
        return data
      }, catchError(this.errorHandler.handleError)));
  }
  deleteProcess(processId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/delete`, { processId })
      .pipe(map(data => {
        return data
      }, catchError(this.errorHandler.handleError)))
      // .subscribe(
      //   data => this.errorHandler.messageHandler(data.responseStatus, "Xóa hồ sơ thành công!")
      //   ,error => {
      //     this.errorHandler.showError(error)
      //   }
      // )
  }
  detailProcess(processId: string) {
    return this.http
      .post<ProcessResponse>(`${environment.apiUrl}/process/indivProcess/detailIndivCif`, { processId })
      .pipe(
        delay(600),map(data => {
        return data
      }, catchError(this.errorHandler.handleError)))
  }
  detailCustomer(processId: string) {
    return this.http
      .get<ProcessResponse>(`${environment.apiUrl}/process/indivProcess/customer/${processId}`)
      .pipe(map(data => {
        return data
      }, catchError(this.errorHandler.handleError)))
  }
}
