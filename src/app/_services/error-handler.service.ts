import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs/internal/observable/throwError";
import {NotificationService} from "../_toast/notification_service";
import {ResponseStatus} from "../_models/response";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private notificationService: NotificationService) { }
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error/ loi phia client
      errorMessage = `Error: ${error.error.message}`;
      this.showError(error.error.message)

    } else {
      // server-side error/ loi phia server
      errorMessage = `Server Error\nError Code: ${error.status}\nMessage: ${error.message}`;
      this.showError(error.message)
    }
    return throwError(errorMessage);
  }

  messageHandler(response: ResponseStatus, successAction: string) {
    if (response) {
      if (response.success == true) {
        this.notificationService.showSuccess(successAction, "Thông báo")
      } else {
        if (response.codes) {
          response.codes.map(
            code => {
              let errorMsg = code.detail.length > 92 ? code.detail.substr(0,92): code.detail
              this.notificationService.showError(errorMsg, "Thông báo")
            }
          )
        }
      }
    }
  }
  showError(errorMessage: string) {
    if (errorMessage == 'No message available' || errorMessage == 'Unknown Error' || errorMessage == null) {
      this.notificationService.showError('Lỗi không xác định', "Thông báo")
    } else this.notificationService.showError(errorMessage, "Thông báo")
  }
  showSuccess(successMessage: string) {
    this.notificationService.showSuccess(successMessage, "Thông báo")
  }
  showErrorMessageList(response: ResponseStatus) {
    if (response.success == false) {
      if (response.codes) {
        response.codes.map(
          code => {
            let errorMsg = code.detail + ': ' + code.msg
            this.notificationService.showError(errorMsg, "Thông báo")
          }
        )
      }else this.notificationService.showError('Lỗi không xác định', "Thông báo")
    }
  }
}
