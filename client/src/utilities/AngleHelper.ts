export class AngleHelper {

  private constructor() {}

  static radiusToDegrees(radius: number) {
    return radius * 180 / Math.PI
  }

  static degreesToRadius(degrees: number) {
    return degrees * Math.PI / 180
  }
}
