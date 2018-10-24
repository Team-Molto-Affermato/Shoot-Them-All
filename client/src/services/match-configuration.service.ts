import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Observable} from "rxjs";
import {Match, MatchAccess} from "../models/match";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MatchConfigurationService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) {

  }

  createNewMatch(match: Match): Observable<Match> {


    const m = {
      roomName: match.name,
      location: {
        type: "Point",
        coordinates: [match.centerPoint.x, match.centerPoint.y]
      },
      max_user: match.maxUser,
      duration: match.duration,
      radius: match.radius,
      state: match.state,
      visibility: match.access,
      password: match.password,

    };

    return this.http.post<Match>("/api/matches", m)
      .pipe(
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
