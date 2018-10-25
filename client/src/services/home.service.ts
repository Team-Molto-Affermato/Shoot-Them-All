import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Match, MatchAccess, MatchState} from "../models/match";
import {Point} from "../models/point";
import {MatchConverterService} from "./match-converter.service";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService,
              private matchCOnverterService: MatchConverterService) {

  }

  getMatches(): Observable<Array<Match>> {

    return this.http.get("/api/matches")
      .pipe(
        catchError(this.errorsHandlerService.handleError),
        map((data: Array<any>) => {

          const matches: Array<Match> = data.map(m => {

            return this.matchCOnverterService.jsonToClass(m);
          });

          return matches;
        })
      );

  }
}
