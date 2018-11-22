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
export class UserScore {
  constructor(public username:String,
              public score: number,
              public team: Team){
  }

}
export class UserInLeaderboard {
  constructor(
    public position:number,
    public username:String,
    public score: number
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
