// import { CompilerConfig } from '@angular/compiler';
import { MatDialogConfig } from '@angular/material/dialog';
;
const dialogConfig = new MatDialogConfig()

export class DialogConfig {

    static configSearchInfoCustom() {
        dialogConfig.width = "800px"
        dialogConfig.position = {}
        return dialogConfig
    }
    static configAddOrDetailUser(data) {
        dialogConfig.width = "820px"
        dialogConfig.position = {}
        dialogConfig.data = { data }
        dialogConfig.disableClose = true
        return dialogConfig
    }
    static configDialog(data) {
        dialogConfig.width = "750px"
        dialogConfig.position = {
            top: '70px'
        }
        dialogConfig.data = { data }
        dialogConfig.disableClose = true
        return dialogConfig
    }
    static configDialogSearch(data) {
        dialogConfig.width = "800px"
        dialogConfig.position = {
            top: '70px'
        }
        dialogConfig.data = { data }
        dialogConfig.disableClose = true
        return dialogConfig
    }
    static configDialogConfirm(data) {
        dialogConfig.width = "430px"
        dialogConfig.position = {
            top: '70px'
        }
        dialogConfig.data = { data }
        dialogConfig.disableClose = true
        return dialogConfig
    }
    static configDialogConfirmDeleteAccount(data) {
        dialogConfig.width = "630px"
        dialogConfig.position = {
            top: '70px'
        }
        dialogConfig.data = { data }
        dialogConfig.disableClose = true
        return dialogConfig
    }
    static configDialogHistory(data) {
        dialogConfig.width = "600px"
        dialogConfig.position = {
            top: '150px'
        }
        dialogConfig.data = { data }
        dialogConfig.disableClose = false
        return dialogConfig
    }
    static configInfomationPopupCIF(data) {
        dialogConfig.width = "1000px"
        dialogConfig.position = {top: '50px'}
        dialogConfig.data = { data }
        dialogConfig.disableClose = true
        return dialogConfig
    }
}
