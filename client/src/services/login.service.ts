import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserData} from "../models/userData";
import {ErrorsHandlerService} from "./errors-handler.service";
import {User} from "../models/user";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) { }

  fetchData(userData: UserData): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };

    alert("chicco");

    return this.http.post<boolean>("/users/"+ userData.username + "/login", userData.password, httpOptions)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
