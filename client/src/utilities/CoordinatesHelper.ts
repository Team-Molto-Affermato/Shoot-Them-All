import {AngleHelper} from "./AngleHelper";

export class Coordinate {

  constructor(public latitude: number,
              public longitude: number) {

  }
}

export class CoordinatesHelper {

  private static unitDegreeLatitudeLength = 111320;
  private static unitDegreeLongitudeLength = (latitude) => {
    return 40075000 * Math.cos(AngleHelper.degreesToRadius(latitude)) / 360;
  };


  private constructor() {
  }

  static latitudeDistanceInMeters(fromLatitude: number, toLatitude: number) {
    return CoordinatesHelper.unitDegreeLatitudeLength * (toLatitude - fromLatitude)
  }

  static longitudeDistanceInMeters(fromLongitude: number, toLongitude: number, latitude: number) {
    return CoordinatesHelper.unitDegreeLongitudeLength(latitude) * (toLongitude - fromLongitude)
  }
}

