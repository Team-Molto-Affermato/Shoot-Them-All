import {Point} from "./point";
import {Match} from "./match";

export class User {
  name: String;
  surname: String;
  username: String;
  password: String;
  email: String;
}
export class UserScore {
  username:String;
  score: Number;
  team: String;
}
export class UserData {
  username: String;
  password: String;
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
