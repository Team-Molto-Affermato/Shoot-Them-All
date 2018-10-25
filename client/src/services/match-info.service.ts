import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Match} from "../models/match";

@Injectable({
  providedIn: 'root'
})
export class MatchInfoService {

  currentMatch: Match = null;

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) {

  }


  setCurrentMatch(match: Match) {
    this.currentMatch = match;
  }

  getCurrentMatch(): Match {
    return this.currentMatch;
  }
}
