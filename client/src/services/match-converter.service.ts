import { Injectable } from '@angular/core';
import {Match, MatchAccess, MatchState} from "../models/match";
import {Point} from "../models/point";

@Injectable({
  providedIn: 'root'
})
export class MatchConverterService {

  constructor() { }

  jsonToClass(m): Match {
    return new Match(
      m.roomName,
      MatchAccess[<string>m.visibility],
      new Point(m.location.coordinates[0], m.location.coordinates[1]),
      m.radius,
      m.starting_time,
      m.duration,
      m.max_user,
      m.password,
      m.users,
      MatchState[<string>m.state])
  }
}
