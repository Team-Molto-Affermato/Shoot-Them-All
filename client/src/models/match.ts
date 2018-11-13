import {Point} from "./point";
import {User} from "./user";

export class Match {

  constructor(public name: string,
              public access: MatchAccess,
              public organization: MatchOrganization,
              public centralPoint: Point,
              public radius: number,
              public createdAt: Date,
              public startingTime: Date,
              public duration: number,
              public maxUser: number,
              public password: string,
              public users: Array<string>,
              public state: MatchState) {}
}

export enum MatchAccess {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}

export enum MatchState {
  SETTING_UP = "SETTING_UP",
  STARTED = "STARTED",
  ENDED = "ENDED"
}

export enum MatchOrganization {
  SINGLE_PLAYER = "SINGLE_PLAYER",
  TEAM = "TEAM"
}
