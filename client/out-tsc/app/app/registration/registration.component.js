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
import { FormBuilder } from "@angular/forms";
import { RegistrationService } from "../../services/registration.service";
import { Router } from "@angular/router";
var RegistrationComponent = /** @class */ (function () {
    function RegistrationComponent(router, formBuilder, registrationService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.registrationService = registrationService;
        this.registrationForm = this.createFormGroup();
    }
    RegistrationComponent.prototype.ngOnInit = function () {
    };
    RegistrationComponent.prototype.createFormGroup = function () {
        return this.formBuilder.group({
            name: '',
            surname: '',
            username: '',
            password: '',
            email: ''
        });
    };
    RegistrationComponent.prototype.register = function () {
        var _this = this;
        alert("Register called");
        // Make sure to create a deep copy of the form-model
        var user = Object.assign({}, this.registrationForm.value);
        alert(user.username);
        this.registrationService.register(user).subscribe(function () {
            alert("Navi called");
            _this.router.navigateByUrl('/home');
        }, function (err) {
            alert(err);
            console.error(err);
        });
        // this.registerService.fetchData(user).subscribe(
        //   (data: User) => {
        //     alert(data);
        //     this.router.navigate(["/home"])
        //   },
        //   error => alert(error)
        // );
    };
    RegistrationComponent = __decorate([
        Component({
            selector: 'app-registration',
            templateUrl: './registration.component.html',
            styleUrls: ['./registration.component.css']
        }),
        __metadata("design:paramtypes", [Router,
            FormBuilder,
            RegistrationService])
    ], RegistrationComponent);
    return RegistrationComponent;
}());
export { RegistrationComponent };
//# sourceMappingURL=registration.component.js.map