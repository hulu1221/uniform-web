import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';
import { NotificationService } from '../_toast/notification_service';
import { ValidatorSpace } from '../_validator/otp.validator';
import { UserService } from '../_services/user.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup
    loading = false
    loadingOTP = false
    submitted = false
    returnUrl: string
    showValidationMsg: boolean
    validationMsg: string
    // checkOtp = false
    fieldTextType = false
    // hiddenForm = false
    showOtpComponent = true
    // otp:any
    validateOTP = false
    config = {
        allowNumbersOnly: false,
        length: 6,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            'width': '60px',
            'height': '50px'
        }
    }
    @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private notificationService: NotificationService,
        private userService: UserService
    ) {
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['./smart-form/']);
        // }
    }
    ngOnInit() {
        this.loginForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            otp: new FormControl('', [ValidatorSpace.cannotContainSpaceOTP])
        });
        // this.loginForm = this.formBuilder.group({
        //     username: ['', Validators.required],
        //     password: ['', Validators.required],
        //     otp:['',Validators.required,OTPValidator.cannotContainSpace]
        // });
        this.showValidationMsg = false;
        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType
    }
    // tslint:disable-next-line:typedef
    onSubmit() {
        this.submitted = true;
        this.showValidationMsg = false;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        let pass = this.f.password.value + this.f.otp.value
        this.loading = true;
        this.authenticationService.login(this.f.username.value, pass)
            .pipe(first())
            .subscribe(
                data => {
                    this.authenticationService.getUserByUserName(this.f.username.value).subscribe(x => {
                        // console.log(x)
                        if (x) {
                            if (x.message.code == "201") {
                                this.showValidationMsg = true
                                this.loading = false
                                this.validationMsg = "Tài khoản chưa được cấp quyền"
                                localStorage.removeItem('currentUser')
                            } else
                                if (x.data !== undefined && x.data !== null) {
                                    localStorage.setItem('function', JSON.stringify(x.data.function))
                                    localStorage.setItem('userInfo', JSON.stringify(x.data.userInfo))
                                    localStorage.setItem('action', JSON.stringify(x.data.action))
                                    localStorage.setItem('role', JSON.stringify(x.data.role))
                                    this.router.navigate(['./smart-form/'])
                                }
                        }
                    })
                },
                error => {
                    this.showValidationMsg = true;
                    // if (error.status === 400){
                    this.validationMsg = 'Thông tin đăng nhập không đúng';
                    // }else if (error.status === 0){
                    // }
                    this.loading = false;
                }
            );
    }
    onOtpChange(otp: any) {
        // this.otp = otp;
    }

    setVal(val: any) {
        this.ngOtpInput.setValue(val);
    }

    toggleDisable() {
        if (this.ngOtpInput.otpForm) {
            if (this.ngOtpInput.otpForm.disabled) {
                this.ngOtpInput.otpForm.enable();
            } else {
                this.ngOtpInput.otpForm.disable();
            }
        }
    }

    onConfigChange() {
        this.showOtpComponent = false;
        setTimeout(() => {
            this.showOtpComponent = true;
        }, 0);
    }
}

