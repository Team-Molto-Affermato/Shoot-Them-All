import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserData} from "../models/userData";
import {ErrorsHandlerService} from "./errors-handler.service";
import {User} from "../models/user";
import {catchError} from "rxjs/operators";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private errorsHandlerService: ErrorsHandlerService) { }

  login(userData: UserData): Observable<any> {

    return this.authenticationService.request('post', "/users/"+ userData.username + "/login", userData)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
