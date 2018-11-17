import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { ChartsModule } from 'ng2-charts';
import {FormsModule} from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

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
import { NavbarComponent } from './navbar/navbar.component';
import { MatchComponent } from './match/match.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { GameMapComponent } from './match/game-map/game-map.component';
import { RadarComponent } from './match/game-map/radar/radar.component';
import { EarthMapComponent } from './match/game-map/earth-map/earth-map.component';
import { MatchLeaderboardComponent } from './match/match-leaderboard/match-leaderboard.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LoadingComponent } from './loading/loading.component';
import { ErrorComponent } from './error/error.component';
import {RoleGuardService as RoleGuard} from "../services/role-guard.service";
import {Role} from "../models/RoleHelper";

export enum ComponentName {
  LOGIN = "login",
  REGISTRATION = "registration",
  HOME = "home",
  MATCH_CONFIGURATION = "matchConfiguration",
  MATCH_INFO = "matchInfo",
  MATCH = "match",
  ERROR = "error",
  LOADING = "loading"
}

const appRoutes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: ComponentName.LOGIN, component: LoginComponent},
  {path: ComponentName.REGISTRATION, component: RegistrationComponent},
  {path: ComponentName.HOME, component: HomeComponent, canActivate: [AuthGuard]},
  {path: ComponentName.MATCH_CONFIGURATION, component: MatchConfigurationComponent, canActivate: [AuthGuard, RoleGuard],
    data: {standardRole: Role.MANAGER, restrictedRole: Role.VISITOR}},
  {path: ComponentName.MATCH_INFO, component: MatchInfoComponent, canActivate: [AuthGuard]},
  {path: ComponentName.MATCH, component: MatchComponent, canActivate: [AuthGuard, RoleGuard],
    data: {standardRole: Role.PLAYER}},
  {path: ComponentName.ERROR, component: ErrorComponent, canActivate: [AuthGuard]},
  {path: ComponentName.LOADING, component: LoadingComponent, canActivate: [AuthGuard]}
];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    MatchConfigurationComponent,
    MatchInfoComponent,
    NavbarComponent,
    MatchComponent,
    GameMapComponent,
    RadarComponent,
    EarthMapComponent,
    MatchLeaderboardComponent,
    LeaderboardComponent,
    LoadingComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
    ChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDu3kkOqXnf2L0xR4ktNS1o31OCCNnIHuk'
    })
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
