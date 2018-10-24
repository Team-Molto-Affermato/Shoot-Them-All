var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { FormBuilder } from "@angular/forms";
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, formBuilder, loginService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.loginService = loginService;
        this.title = "Shoot Them All";
        this.loginForm = this.createFormGroup();
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.createFormGroup = function () {
        return this.formBuilder.group({
            username: '',
            password: ''
        });
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        var userData = Object.assign({}, this.loginForm.value);
        this.loginService.login(userData).subscribe(function () {
            _this.router.navigateByUrl('/home');
        }, function (err) {
            console.error(err);
        });
        // this.loginService.fetchData(userData).subscribe(
        //   (data: boolean) => {
        //     alert(data);
        //     if(data) {
        //       this.router.navigate(["/home"])
        //     }
        //
        //   },
        //    error => alert(error)
        // );
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        __metadata("design:paramtypes", [Router,
            FormBuilder,
            LoginService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map