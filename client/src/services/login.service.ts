import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ErrorsHandlerService} from "./errors-handler.service";
import {User, UserData} from "../models/user";
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

    return this.authenticationService.request('post', "/login", userData)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
