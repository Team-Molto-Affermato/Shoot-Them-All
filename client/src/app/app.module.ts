import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import {RouterModule, Routes} from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { MatchConfigurationComponent } from './match-configuration/match-configuration.component';
import { MatchInfoComponent } from './match-info/match-info.component';
import {AuthenticationService} from "../services/authentication.service";
import {AuthGuardService as AuthGuard} from "../services/auth-guard.service";

const appRoutes: Routes = [
  {path: "", redirectTo: 'home', pathMatch: 'full'},
  {path: "login", component: LoginComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "home", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "matchConfiguration", component: MatchConfigurationComponent, canActivate: [AuthGuard]},
  {path: "matchInfo", component: MatchInfoComponent, canActivate: [AuthGuard]}
];



@NgModule({
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
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
