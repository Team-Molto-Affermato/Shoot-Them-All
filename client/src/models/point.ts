export class Point {
  constructor(public latitude: number,
              public longitude: number) { }
}
export class UserPosition {
  constructor(public username: string,
              public position: Point,
              public team: String){

  }
}
