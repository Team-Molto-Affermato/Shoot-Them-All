import {Point} from "./point";
import {Match} from "./match";
import {Team} from "./team";

export class User {
  name: String;
  surname: String;
  username: String;
  password: String;
  email: String;
}
export class BasicUserInfo {
  constructor(
    public name: String,
    public surname: String,
    public username: String,
    public email: String,
    public score: number,
  ){
  }
}
export class MatchCount {
  constructor(
    public count:number
  ){}
}
export class CompleteUserInfo {
  constructor(
      public basicUserInfo:BasicUserInfo,
      public numMatches: number,
      public leaderboardPosition: number,
      public level:number){
  }
}
export class UserScore {
  constructor(public username:String,
              public score: number,
              public team: Team,
              public scoreG: number
              ){
  }

}
export class UserInLeaderboard {
  constructor(
    public position:number,
    public username:String,
    public score: number,
    public ranking: string
  ){
  }
}
export class UserData {
  constructor(public username: String,
              public password: String) {
  }
}

export class UserInMatch {
  constructor(public username: string,
              public position: Point,
              public score: number) {
  }

}


export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

export interface TokenResponse {
  token: string;
}

export const rankings:Array<string> = [
  "Recruit",
  "Private",
  "Corporal",
  "Sergeant",
  "Master Sergeant",
  "Sergeant Major",
  "Lieutenant",
  "Captain",
  "Major",
  "Colonel",
  "Brigadier General",
  "Major general",
  "Lieutenant general",
  "General",
  "Global general"
]
