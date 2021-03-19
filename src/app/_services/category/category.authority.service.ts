import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {environment} from "../../../environments/environment";
import {catchError, map,delay} from "rxjs/operators";
import {Response} from "../../_models/response";
import { DistrictAndWardModel, MenuGeneralModel } from 'src/app/_models/category.authority';
import { DistrictRequest, WardRequest } from 'src/app/_models/request';
import { AuthorExpireAndAuthorType } from 'src/app/_models/category/categoryList';


@Injectable({
  providedIn: 'root'
})
export class CategoryAuthorityService {
  sub: string = '/account/'
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService
  ) { }
  // Gioi tinh
  apiGender() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}gender/listAll`)
  }
  getGenders() {
    return this.apiGender().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)), catchError(this.errorHandler.handleError)))
  }
  // Loai giay to tuy than
  apiPerDocType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}perDocType/listAll`).pipe()
  }
  getPerDocTypes() {
    return this.apiPerDocType().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)), catchError(this.errorHandler.handleError)))
  }
  // Nganh nghe
  apiIndustry() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}industry/listAll`)
  }
  getIndustries() {
    return this.apiIndustry().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)), catchError(this.errorHandler.handleError)))
  }
  //pham vi uy quyen
  getAuthorType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}/authorType/listAll`)
  }
  getLstAuthorType() {
    return this.getAuthorType().pipe(map(data => data.items.map(item => new AuthorExpireAndAuthorType(item)), catchError(this.errorHandler.handleError)))
  }

  //thoi gian uy quyen
  getAuthorExpire() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}/authorExpire/listAll`)
  }
  getLstAuthorExpire(){
    return this.getAuthorExpire().pipe(map(data => data.items.map(item => new AuthorExpireAndAuthorType(item)), catchError(this.errorHandler.handleError)))
  }

  /* Dia chi hien tai, thuong tru cua khach hang */
  // Quoc tich, quoc gia
  apiCountry() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}country/listAll`)
  }
  getCountries() {
    return this.apiCountry().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)), catchError(this.errorHandler.handleError)))
  }

  // Tinh/ thanh pho
  apiCity() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}city/listAll`)
  }
  getCities() {
    return this.apiCity().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)), catchError(this.errorHandler.handleError)))
  }

  // Quan/ huyen
  apiDistrict(cityCode: any) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}district/listAll`, cityCode)
  }
  getDistrictByCityId(code: string) {
    // let requestObj = new DistrictRequest(cityCode)
    let cityCode = {}
    cityCode['cityCode'] = code
    return this.apiDistrict(cityCode).pipe(map(data => data.items.map(item => new DistrictAndWardModel(item)), catchError(this.errorHandler.handleError)))
  }

  // Phuong/ xa
  apiWard(districtCode: any) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}ward/listAll`, districtCode)
  }
  getWardByDistrictId(code: string) {
    let districtCode = {}
    districtCode['districtCode'] = code
    return this.apiWard(districtCode).pipe(map(data => data.items.map(item => new DistrictAndWardModel(item)), catchError(this.errorHandler.handleError)))
  }
  /* Ket thuc Dia chi hien tai, thuong tru */

}


