import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Observable} from "rxjs";
import {Match} from "../models/match";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MatchConfigurationService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) {

  }

  createNewMatch(match: Match): Observable<Match> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      })
    };

    return this.http.post<Match>("/matches", match, httpOptions)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
