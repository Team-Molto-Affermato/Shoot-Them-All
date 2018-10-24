import {Point} from "./point";
import {User} from "./user";

export class Match {

  constructor(public name: string,
              public access: MatchAccess,
              public centerPoint: Point,
              public radius: number,
              public startingTime: Date,
              public duration: number,
              public maxUser: number,
              public password: string,
              public users: Array<string>,
              public state: MatchState) {}
}

export enum MatchAccess {
  PUBLIC,
  PRIVATE
}

export enum MatchState {
  SETTING_UP,
  STARTED,
  ENDED
}
