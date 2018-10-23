import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ErrorsHandlerService} from "./errors-handler.service";
import {AuthenticationService} from "./authentication.service";
import {UserData} from "../models/userData";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private errorsHandlerService: ErrorsHandlerService) { }

  register(user: User): Observable<User> {

    return this.authenticationService.request<User>('post', "/users/"+ user.username + "/login", user)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }

}
