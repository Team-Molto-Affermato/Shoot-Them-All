import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ErrorsHandlerService} from "./errors-handler.service";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) { }

  fetchData(user: User): Observable<User> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };

    return this.http.post<User>("/users", user, httpOptions)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }

}
