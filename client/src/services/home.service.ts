import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Match} from "../models/match";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) {

  }

  getMatches(): Observable<Array<Match>> {

    return this.http.get<Array<Match>>("/api/matches")
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
