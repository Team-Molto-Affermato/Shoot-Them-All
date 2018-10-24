var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { MatchConfigurationComponent } from './match-configuration/match-configuration.component';
import { MatchInfoComponent } from './match-info/match-info.component';
import { AuthenticationService } from "../services/authentication.service";
var appRoutes = [
    { path: "", component: LoginComponent },
    { path: "login", component: LoginComponent },
    { path: "registration", component: RegistrationComponent },
    { path: "home", component: HomeComponent },
    { path: "matchConfiguration", component: MatchConfigurationComponent },
    { path: "matchInfo", component: MatchInfoComponent }
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                AppComponent,
                LoginComponent,
                RegistrationComponent,
                HomeComponent,
                MatchConfigurationComponent,
                MatchInfoComponent
            ],
            imports: [
                BrowserModule,
                RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
                HttpClientModule,
                ReactiveFormsModule
            ],
            providers: [AuthenticationService],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map