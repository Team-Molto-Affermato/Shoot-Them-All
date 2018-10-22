import {Point} from "./point";
import {User} from "./user";

export class Match {

  constructor(public id: String,
              public matchBaseInfo: MatchBaseInfo,
              public players: Array<User>,
              public matchState: MatchState) {}
}

export class MatchBaseInfo {

  constructor(public access: MatchAccess,
              public centerPoint: Point,
              public radius: number,
              public startingTime: number,
              public duration: number,
              public maxPlayerNumber: number,
              public password: string) {}
}

export enum MatchAccess {
  PUBLIC,
  PRIVATE
}

export enum MatchState {
  WAITING,
  STARTED,
  ENDED
}
