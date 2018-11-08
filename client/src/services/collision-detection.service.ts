import { Injectable } from '@angular/core';
import {from} from "rxjs";
import {Point, UserPosition} from "../models/point";

@Injectable({
  providedIn: 'root'
})
export class CollisionsDetectionService {

  private maxLateralDistance = 5;
  private maxVerticalDistance = 30;

  constructor() { }

  checkCollisions(position: Point, orientationAngle: number, players: Array<UserPosition>) {

    alert(orientationAngle);

    const xp = position.x;
    const yp = position.y;
    const m = Math.tan(this.degFromRad(orientationAngle));
    const q = yp - m*xp;


    var hitPlayers = [];

    for (const i in players) {
      const player = players[i];

      const l = this.lateralDistance(player.position, m, q);
      if (l < this.maxLateralDistance) {
        const v = this.verticalDistance(position, player.position, l);
        if (v < this.maxVerticalDistance) {
          if (this.checkOrientation(position, player.position, orientationAngle)) {
            hitPlayers.push(player);
          }
        }
      }
    }

    console.log(players);

    return hitPlayers;
  }

  private degFromRad(degrees) {
    return degrees * Math.PI/180;
  }

  private lateralDistance(point: Point, m: number, q: number): number {
    const num = Math.abs(point.y - (point.x * m +q));

    const den = Math.sqrt(1 + Math.pow(m, 2));

    return num/den;
  }

  private verticalDistance(sourcePoint: Point, point: Point, lateralDistance: number): number {
    const hypotenuse = this.pointDistance(sourcePoint, point);

    return Math.sqrt(Math.pow(hypotenuse, 2) + Math.pow(lateralDistance, 2));
  }

  private pointDistance(fromPoint: Point, toPoint: Point): number {
    return Math.sqrt(Math.pow(toPoint.x - fromPoint.x, 2) + Math.pow(toPoint.y - fromPoint.y, 2));
  }

  private checkOrientation(sourcePoint: Point, point: Point, orientationAngle: number): boolean {
    if(orientationAngle >= 315 || orientationAngle < 45) {
      return point.x >= sourcePoint.x;
    } else if (orientationAngle >= 45 && orientationAngle < 135) {
      return point.y >= sourcePoint.y;
    } else if (orientationAngle >= 135 && orientationAngle < 225) {
      return point.x <= sourcePoint.x;
    } else {
      return point.y <= sourcePoint.y;
    }
  }
}

