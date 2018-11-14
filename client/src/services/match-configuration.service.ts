import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Observable} from "rxjs";
import {Match, MatchAccess} from "../models/match";
import {catchError, map} from "rxjs/operators";
import {MatchConverterService} from "./match-converter.service";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class MatchConfigurationService {

  constructor(private http: HttpClient,
              private matchConverterService: MatchConverterService,
              private errorsHandlerService: ErrorsHandlerService) {

  }

  createNewMatch(match: Match): Observable<Match> {


    const m = {
      roomName: match.name,
      location: {
        type: "Point",
        coordinates: [match.centralPoint.latitude, match.centralPoint.longitude]
      },
      type: match.organization,
      max_user: match.maxUser,
      duration: match.duration,
      radius: match.radius,
      state: match.state,
      visibility: match.access,
      password: match.password,

    };

    return this.http.post<any>("/api/matches", m)
      .pipe(map(m => this.matchConverterService.jsonToClass(m)),
        catchError(this.errorsHandlerService.handleError)
      );
  }
}
