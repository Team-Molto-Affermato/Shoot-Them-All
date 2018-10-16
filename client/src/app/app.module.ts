import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

const appRoutes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
