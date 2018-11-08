import { Injectable } from '@angular/core';
import {from} from "rxjs";
import {Point, UserPosition} from "../models/point";
import {CoordinatesHelper} from "../utilities/CoordinatesHelper";

@Injectable({
  providedIn: 'root'
})
export class CollisionsDetectionService {

  private maxLateralDistance = 10;
  private maxVerticalDistance = 100;

  constructor() { }

  checkCollisions(position: Point, orientationAngle: number, players: Array<UserPosition>) {

    const xp = position.longitude;
    const yp = position.latitude;
    const m = Math.tan(this.degFromRad(orientationAngle));
    const q = yp - m*xp;


    var hitPlayers = [];

    for (const i in players) {
      const player = players[i];

      const lateralDistance = this.lateralDistance(player.position, m, q);
      const lateralDistanceInMeters = lateralDistance * CoordinatesHelper.unitDegreeLongitudeLength(player.position.latitude);
      if (lateralDistanceInMeters < this.maxLateralDistance) {
        const verticalDistance = this.verticalDistance(position, player.position, lateralDistance);
        const verticalDistanceInMeters = verticalDistance * CoordinatesHelper.unitDegreeLatitudeLength;
        if (verticalDistanceInMeters < this.maxVerticalDistance) {
          if (this.checkOrientation(position, player.position, orientationAngle)) {
            hitPlayers.push(player);
          }
        }
      }
    }

    hitPlayers.forEach(p => alert(p.username));

    return hitPlayers;
  }

  private degFromRad(degrees) {
    return degrees * Math.PI/180;
  }

  private lateralDistance(point: Point, m: number, q: number): number {
    const num = Math.abs(point.latitude - (point.longitude * m +q));
    const den = Math.sqrt(1 + Math.pow(m, 2));
    return num/den;
  }

  private verticalDistance(sourcePoint: Point, point: Point, lateralDistance: number): number {
    const hypotenuse = this.pointDistance(sourcePoint, point);
    return Math.sqrt(Math.pow(hypotenuse, 2) + Math.pow(lateralDistance, 2));
  }

  private pointDistance(fromPoint: Point, toPoint: Point): number {
    return Math.sqrt(Math.pow(toPoint.longitude - fromPoint.longitude, 2) + Math.pow(toPoint.latitude - fromPoint.latitude, 2));
  }

  private checkOrientation(sourcePoint: Point, point: Point, orientationAngle: number): boolean {
    if(orientationAngle >= 315 || orientationAngle < 45) {
      return point.longitude >= sourcePoint.longitude;
    } else if (orientationAngle >= 45 && orientationAngle < 135) {
      return point.latitude >= sourcePoint.latitude;
    } else if (orientationAngle >= 135 && orientationAngle < 225) {
      return point.longitude <= sourcePoint.longitude;
    } else {
      return point.latitude <= sourcePoint.latitude;
    }
  }
}

