import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import * as moment from "moment";
// ngày tương lai
export function futureDate(control: AbstractControl) : ValidationErrors | null {
    const now = moment(new Date(moment().format('yyyy-MM-DD')))
    let cond = moment(new Date(control.value)).diff(now, "day")
    return cond > 0 ? { 'futureDate' : { isFuture : true, value: control.value} } : null;
}
// ngày quá khứ
export function pastDate(control: AbstractControl) : ValidationErrors | null {
  const now = moment(new Date(moment().format('yyyy-MM-DD')))
  let cond = moment(new Date(control.value)).diff(now, "day")
  return cond < 0 ? { 'pastDate' : { isPast : true, value: control.value} } : null;
}
// ngày bắt đầu phải nhỏ hơn ngày kết thúc
export function BiggerDate(startDate: string, endDate: string) {
  return (group: FormGroup): { [key: string]: any } => {
    const start = moment(new Date(group.controls[startDate].value))
    const end = moment(new Date(group.controls[endDate].value))
    return (start.diff(end, "day") <= 0) ?
      null :
      {'smallerDate': {bigger: true, value: endDate}}
  }
}
/**
 * startDate < middleDate < endDate
 * @example 2021-01-01 < 2021-02-02 < 2022-12-30
 */
export function Bigger3Date(startDate: string, middleDate: string, endDate: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const start = moment(new Date(group.controls[startDate].value))
    const middle = moment(new Date(group.controls[middleDate].value))
    const end = moment(new Date(group.controls[endDate].value))
    if (start.diff(middle, "day") <= 0 && middle.diff(end, "day") <= 0) {
      return null
    } else if (start.diff(middle, "day") > 0 && (middle.diff(end, "day") <= 0)) {
      return { 'biggerDate' : { bigger : true, value: middleDate} }
    } else if (start.diff(middle, "day") <= 0 && middle.diff(end, "day") > 0) {
      return { 'biggerDate' : { bigger : true, value: endDate} }
    } else if (start.diff(middle, "day") > 0 && !end.isValid()) {
      return { 'biggerDate' : { bigger : true, value: middleDate} }
    } else if (start.diff(end, "day") > 0 && !middle.isValid()) {
      return { 'biggerDate' : { bigger : true, value: endDate} }
    }
    else return { 'biggerDate' : { bigger : true, value: ''} }
  }
}
export function Bigger3Date2(startDate: string, middleDate: string, endDate: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const start = moment(new Date(group.controls[startDate].value))
    const middle = moment(new Date(group.controls[middleDate].value))
    const end = moment(new Date(group.controls[endDate].value))
    if (start.diff(middle, "day") <= 0 && middle.diff(end, "day") <= 0) {
      return null
    } else if (start.diff(middle, "day") > 0 && (middle.diff(end, "day") <= 0)) {
      return { 'biggerDate2' : { bigger : true, value: middleDate} }
    } else if (start.diff(middle, "day") <= 0 && middle.diff(end, "day") > 0) {
      return { 'biggerDate2' : { bigger : true, value: endDate} }
    } else if (start.diff(middle, "day") > 0 && !end.isValid()) {
      return { 'biggerDate2' : { bigger : true, value: middleDate} }
    } else if (start.diff(end, "day") > 0 && !middle.isValid()) {
      return { 'biggerDate2' : { bigger : true, value: endDate} }
    }
    else return { 'biggerDate2' : { bigger : true, value: ''} }
  }
}
export function Bigger3Date3(startDate: string, middleDate: string, endDate: string) {
  return (group: FormGroup): {[key: string]: any} => {
    const start = moment(new Date(group.controls[startDate].value))
    const middle = moment(new Date(group.controls[middleDate].value))
    const end = moment(new Date(group.controls[endDate].value))
    if (start.diff(middle, "day") <= 0 && middle.diff(end, "day") <= 0) {
      return null
    } else if (start.diff(middle, "day") > 0 && (middle.diff(end, "day") <= 0)) {
      return { 'biggerDate3' : { bigger : true, value: middleDate} }
    } else if (start.diff(middle, "day") <= 0 && middle.diff(end, "day") > 0) {
      return { 'biggerDate3' : { bigger : true, value: endDate} }
    } else if (start.diff(middle, "day") > 0 && !end.isValid()) {
      return { 'biggerDate3' : { bigger : true, value: middleDate} }
    } else if (start.diff(end, "day") > 0 && !middle.isValid()) {
      return { 'biggerDate3' : { bigger : true, value: endDate} }
    }
    else return { 'biggerDate3' : { bigger : true, value: ''} }
  }
}

/**
 * @example '^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$' matched string is a valid email
 */
export function ForbiddenNameValidator(name: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const forbidden = name.test(control.value.toLowerCase());
    return forbidden ? { 'forbiddenName' : { value: control.value } } : null;
  };
}

/**
 * @example '^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$' matched string is a valid email
 */
export function CustomValidEmail(control: AbstractControl) : ValidationErrors | null {
  const validEmailRegex = new RegExp('^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$');
  const validEmail = validEmailRegex.test(control.value.toLowerCase());
  return validEmail ? null : { 'CustomValidEmail' : { valid : false, value: control.value} }
}
