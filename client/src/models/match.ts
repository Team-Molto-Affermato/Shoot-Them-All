import {Point} from "./point";
import {User} from "./user";

export class Match {

  constructor(public id: string,
              public access: string,
              public centerPoint: Point,
              public radius: number,
              public startingTime: Date,
              public duration: number,
              public maxUser: number,
              public password: string,
              public users: Array<string>,
              public state: string) {}
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
