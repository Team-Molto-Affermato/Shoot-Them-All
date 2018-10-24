import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Match} from "../models/match";
import {TokenResponse} from "../models/user";
import {Point} from "../models/point";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) {

  }

  getMatches(): Observable<Array<Match>> {

    return this.http.get("/api/matches")
      .pipe(
        catchError(this.errorsHandlerService.handleError),
        map((data: Array<any>) => {

          const matches: Array<Match> = data.map(m => {
            return new Match(
              m.roomName,
              m.visibility,
              new Point(m.location.coordinates[0], m.location.coordinates[1]),
              m.radius,
              m.starting_time,
              m.duration,
              m.max_user,
              m.password,
              m.users,
              m.state)
          });

          return matches;
        })
      );

  }
}
