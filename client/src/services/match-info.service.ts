import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorsHandlerService} from "./errors-handler.service";
import {Match} from "../models/match";

@Injectable({
  providedIn: 'root'
})
export class MatchInfoService {

  currentMatchId: String = null;

  constructor(private http: HttpClient,
              private errorsHandlerService: ErrorsHandlerService) {

  }


  setCurrentMatchId(matchId: String) {
    this.currentMatchId = matchId;
  }

  getCurrentMatchId(): String {
    return this.currentMatchId;
  }
}
