import {AngleHelper} from "./AngleHelper";
import {Point} from "../models/point";

export class CoordinatesHelper {

  public static unitDegreeLatitudeLength = 111320;
  public static unitDegreeLongitudeLength = (latitude) => {
    return 40075000 * Math.cos(AngleHelper.degreesToRadius(latitude)) / 360;
  };


  private constructor() {
  }

  static latitudeSignedDistanceInMeters(fromLatitude: number, toLatitude: number) {
    return CoordinatesHelper.unitDegreeLatitudeLength * (toLatitude - fromLatitude)
  }

  static longitudeSignedDistanceInMeters(fromLongitude: number, toLongitude: number, latitude: number) {
    return CoordinatesHelper.unitDegreeLongitudeLength(latitude) * (toLongitude - fromLongitude)
  }

  static pointDistance(fromPoint: Point, toPoint: Point): number {
    var R = 6371000; // Radius of the earth in meters
    var dLat = AngleHelper.degreesToRadius(toPoint.latitude-fromPoint.latitude);  // deg2rad below
    var dLon = AngleHelper.degreesToRadius(toPoint.longitude-fromPoint.longitude);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(AngleHelper.degreesToRadius(fromPoint.latitude)) * Math.cos(AngleHelper.degreesToRadius(toPoint.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in meters
    return d;
  }
}

