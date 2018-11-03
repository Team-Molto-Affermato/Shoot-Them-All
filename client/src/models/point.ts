export class Point {
  constructor(public x: number,
              public y: number) { }
}
export class UserPosition {
  constructor(public username: string,
              public position: Point){

  }
}
