import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {environment} from "../../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {Response} from "../../_models/response";
import {Category, RegisType} from "../../_models/category/category";
import {DistrictRequest, WardRequest} from "../../_models/request";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  sub: string = '/process/'
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService
  ) { }
  // Gioi tinh
  apiGender() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}gender/listAll`)
  }
  getGenders() {
    return this.apiGender().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  // Loai giay to tuy than
  apiPerDocType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}perDocType/listAll`)
  }
  getPerDocTypes() {
    return this.apiPerDocType().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  // Nganh nghe
  apiIndustry() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}industry/listAll`)
  }
  getIndustries() {
    return this.apiIndustry().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  // Trinh do hon nhan
  apiMaritalStatus() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}maritalStatus/listAll`)
  }
  getMaritalStatus() {
    return this.apiMaritalStatus().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // Chi nhanh
  apiBranch() {
    return this.http
      .get<Response>(`${environment.apiUrl}/admin/branch/listAll`)
  }
  getBranch() {
    return this.apiBranch().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // sector
  apiSector() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}sector/listAll`)
  }
  getSector() {
    return this.apiSector().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  // Trinh do hoc van
  apiEducation() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}education/listAll`)
  }
  getEducation() {
    return this.apiEducation().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  // Muc thu nhap
  apiIncomeLevel() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}income/listAll`)
  }
  getIncomeLevel() {
    return this.apiIncomeLevel().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // Chuc vu
  apiPosition() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}position/listAll`)
  }
  getPosition() {
    return this.apiPosition().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  /* Dia chi hien tai, thuong tru cua khach hang */
  // Quoc tich, quoc gia
  apiCountry() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}country/listAll`)
  }
  getCountries() {
    return this.apiCountry().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // Tinh/ thanh pho
  apiCity() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}city/listAll`)
  }
  getCities() {
    return this.apiCity().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // Quan/ huyen
  apiDistrict(requestBody: DistrictRequest) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}district/list`, requestBody)
  }
  getDistrictByCityId(cityId: string) {
    let requestObj = new DistrictRequest(cityId)
    return this.apiDistrict(requestObj).pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // Phuong/ xa
  apiWard(requestBody: WardRequest) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}ward/list`, requestBody)
  }
  getWardByDistrictId(districtId: string) {
    let requestObj = new WardRequest(districtId)
    return this.apiWard(requestObj).pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  /* Ket thuc Dia chi hien tai, thuong tru */

  // Trang thai su dung
  getStatus() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}status/listAll`)
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }

  // Trang thai ho so
  getProcessStatus() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}processStatus/listAll`)
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
  // Loai ho so
  getRegisType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}regisType/listAll`)
      .pipe(map(data => data.items.map(item => new RegisType(item)), catchError(this.errorHandler.handleError)))
  }

  // Loai khach hang
  getCustomerType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}customerType/listAll`)
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)))
  }
}


