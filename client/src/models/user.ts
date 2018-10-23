export class User {
  name: String;
  surname: String;
  username: String;
  password: String;
  email: String;
}

export class UserData {
  username: String;
  password: String;
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
