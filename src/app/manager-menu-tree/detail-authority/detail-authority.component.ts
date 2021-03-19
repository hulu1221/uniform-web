import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from "@angular/common";
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { IndivCifService } from 'src/app/_services/indiv-cif.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ViewChild } from '@angular/core';
import { DialogComponent } from '../_dialog/dialog.component';
import { DialogService } from '../_dialog/dialog.service';
import { AuthorityAccountService } from '../../_services/authority-account.service';
import { ResponseStatus } from '../../_models/response';
import { AccountModel } from 'src/app/_models/account';
import { AuthorityModel } from 'src/app/_models/authority';
import { AccountService } from 'src/app/_services/account.service';
import { AuthorExpireAndAuthorType, CategoryAuthority } from 'src/app/_models/category/categoryList';
import { CategoryAuthorityService } from 'src/app/_services/category/category.authority.service';
import { ConstantUtils } from 'src/app/_utils/_constant';
declare var $: any;
@Component({
    selector: 'app-detail-authority',
    templateUrl: './detail-authority.component.html',
    styleUrls: ['./detail-authority.component.scss']
})
export class DetailAuthorityComponent implements OnInit {
    submitted = false
    processId: any
    accountId: string
    id: string
    response: ResponseStatus
    objAccount: AccountModel = new AccountModel()
    objAuthority: AuthorityModel = new AuthorityModel()
    // categories: CategoryAuthority
    lstAuthorType: AuthorExpireAndAuthorType[]
    lstAuthorExpire: AuthorExpireAndAuthorType[]
    birthDate: any
    issueDate: any
    radioCheck: any
    // radioCheckExpire: any
    accountNumber: any
    checkBoxTrue: boolean
    booleanOrther: boolean
    valueOrther: any
    isChecked: boolean
    limitValue: any
    _constant: ConstantUtils = new ConstantUtils()
    @ViewChild('appDialog', { static: true }) appDialog: DialogComponent;
    detailProcess: DetailProcess = new DetailProcess(null)
    constructor(private router: Router, private cifService: IndivCifService,
        private authorityAccount: AuthorityAccountService,
        private errorHandler: ErrorHandlerService,
        private dialogService: DialogService,
        private route: ActivatedRoute, private _location: Location, private missionService: MissionService,
        private accountService: AccountService, private authorityService: AuthorityAccountService,
        private category: CategoryAuthorityService, private datePipe: DatePipe) {
    }
    showDialog() {
        this.dialogService.show()
            .then((res) => {
                this.deleteAuthority()
            })
            .catch((err) => {

            });
    }
    ngOnInit() {
        this.dialogService.register(this.appDialog);
        $('.childName').html('Chi tiết ủy quyền')
        this.processId = this.route.snapshot.paramMap.get('processId')
        this.accountId = this.route.snapshot.paramMap.get('accountId')
        this.id = this.route.snapshot.paramMap.get('id')
        this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')))
        this.getDataSelect()
        this.getDetailAccountId(this.accountId)
        this.getDetailAuthority(this.id)
    }
    ngAfterViewInit() {
        
    }
    getDataSelect() {
        // this.categories = new CategoryAuthority();
        this.category.getLstAuthorType().subscribe(data => {
                this.lstAuthorType = data
        })
        this.category.getLstAuthorExpire().subscribe(data => {
            this.lstAuthorExpire = data
        })
    }
    getProcessInformation(processId) {
        this.missionService.setLoading(true)
        if (processId) {
            this.processId = processId
            this.cifService.detailProcess(processId).subscribe(data => {
                this.detailProcess = new DetailProcess(data.customer)
                this.missionService.setLoading(false)
            },
                error => {
                    this.errorHandler.showError(error)
                    this.missionService.setLoading(false)
                },
                () => {
                    this.missionService.setLoading(false)
                    if (!this.detailProcess.processId) this.errorHandler.showError('Không lấy được thông tin hồ sơ')
                }
            )
            this.missionService.setProcessId(processId)
        }
    }
    getDetailAccountId(id: any) {
        let obj = {}
        obj["id"] = id
        this.accountService.getDetailAccount(obj).subscribe(data => {
            this.objAccount = data.item
            if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber === null) {
                this.accountNumber = "Tài khoản mới " + this.objAccount.accountIndex
            } else if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber !== null) {
                this.accountNumber = this.objAccount.accountNumber
            }
        })
    }
    onBlurMethod(val: any) {
        let str = val.toString(),
            parts = false, output = [], i = 1, formatted = null;
        str = str.split("").reverse();
        if (str.indexOf(".") < 0) {
            for (let j = 0, len = str.length; j < len; j++) {
                if (str[j] != ",") {
                    output.push(str[j]);
                    if (i % 3 == 0 && j < (len - 1)) {
                        output.push(".");
                    }
                    i++;
                }
            }
        } else {
            output = val
        }

        formatted = output.reverse().join("");
        this.limitValue = formatted
    }
    getDetailAuthority(id: any) {
        let obj = {}
        obj["id"] = id
        this.authorityService.getDetailAuthority(obj).subscribe(rs => {
            this.objAuthority = rs['item']
            let newBirthDate = this.objAuthority.birthDate !== null ? new Date(this.objAuthority.birthDate) : null
            let newIssueDate = this.objAuthority.issueDate !== null ? new Date(this.objAuthority.issueDate) : null
            let newDateFrom = this.objAuthority.validFrom !== null ? new Date(this.objAuthority.validFrom) : null
            let newDateTo = this.objAuthority.validTo !== null ? new Date(this.objAuthority.validTo) : null
            this.radioCheck = this.objAuthority.residence === true ? true : false
            this.radioCheck = rs['item'].residence === true ? true : false
            this.birthDate = newBirthDate !== null ? this.datePipe.transform(newBirthDate, 'dd/MM/yyyy') : null
            this.issueDate = newIssueDate !== null ? this.datePipe.transform(newIssueDate, 'dd/MM/yyyy') : null
            let returnDateFrom = newDateFrom !== null ? this.datePipe.transform(newDateFrom, 'dd/MM/yyyy') : null
            let returnDateTo = newDateTo !== null ? this.datePipe.transform(newDateTo, 'dd/MM/yyyy') : null
            this.objAuthority.validFrom = returnDateFrom
            this.objAuthority.validTo = returnDateTo
            this.checkBoxTrue = (this.objAuthority.currentCountryCode === this.objAuthority.residenceCountryCode)
                && (this.objAuthority.currentCityCode === this.objAuthority.residenceCityCode) &&
                (this.objAuthority.currentDistrictCode === this.objAuthority.residenceDistrictCode) &&
                (this.objAuthority.currentWardCode === this.objAuthority.residenceWardCode) &&
                (this.objAuthority.currentStreetNumber === this.objAuthority.residenceStreetNumber) ? true : undefined
            if (this.lstAuthorType !== undefined) {
                for (let index = 0; index < this.objAuthority.authorTypes.length; index++) {
                    this.returnCheckBox(this.objAuthority.authorTypes[index])
                    if (this.objAuthority.authorTypes[index].authorTypeCode === this._constant.OTHER) {
                        this.booleanOrther = true
                        this.valueOrther = this.objAuthority.authorTypes[index].authorTypeFreeText
                    } else if (this.objAuthority.authorTypes[index].authorTypeCode === this._constant.DEPOSIT_AND_WITHDRAW ||
                        this.objAuthority.authorTypes[index].authorTypeCode === this._constant.ALL) {
                        this.isChecked = true
                        this.onBlurMethod(this.objAuthority.authorTypes[index].limitAmount)
                    }
                }
            }
            if (this.lstAuthorExpire !== undefined) {
                for (let index = 0; index < this.lstAuthorExpire.length; index++) {
                    if (this.objAuthority.expireAuthorCode === this.lstAuthorExpire[index].code) {
                        this.lstAuthorExpire[index]['checked'] = true
                        // this.radioCheckExpire = true
                        break
                    }
                }
            }
        })
    }
    returnCheckBox(item: any) {
        for (let index = 0; index < this.lstAuthorType.length; index++) {
            if (this.lstAuthorType[index].code === item.authorTypeCode) {
                this.lstAuthorType[index]['checked'] = true
            }
        }

    }
    backPage() {
        this._location.back();
    }
    createAuthority() {
    }
    deleteAuthority() {
        return this.authorityAccount.delete({ id: this.id }).subscribe(
            data => {
                if (data.responseStatus) {
                    this.response = data.responseStatus
                }
            }
            , error => this.errorHandler.showError(error)
            , () => {
                if (this.response) {
                    this.errorHandler.messageHandler(this.response, 'Xóa ủy quyền thành công')
                    if (this.response.success == true) {
                        this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }])
                    }
                } else this.errorHandler.showError('Lỗi không xác định')
            }
        )
    }

    updateAuthority() {
        this.router.navigate(['./smart-form/manager/updateAuthority', { processId: this.processId, accountId: this.accountId, id: this.id }])
    }
}
