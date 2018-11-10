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

const appRoutes: Routes = [
  {path: "", redirectTo: 'home', pathMatch: 'full'},
  {path: "login", component: LoginComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "home", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "matchConfiguration", component: MatchConfigurationComponent, canActivate: [AuthGuard]},
  {path: "matchInfo", component: MatchInfoComponent, canActivate: [AuthGuard]},
  {path: "match", component: MatchComponent, canActivate: [AuthGuard]}
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
    EarthMapComponent
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
