import { Injectable } from '@angular/core';
import {from} from "rxjs";
import {Point, UserPosition} from "../models/point";
import {CoordinatesHelper} from "../utilities/CoordinatesHelper";
import {AngleHelper} from "../utilities/AngleHelper";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CollisionsDetectionService {

  private maxLateralDistance = 20;
  private maxVerticalDistance = 500;

  constructor(
    private http:HttpClient
  ) { }

  checkCollisions(position: Point, orientationAngle: number, players: Array<UserPosition>,roomName:String,username:String) {

    const xp = position.longitude;
    const yp = position.latitude;
    const m = Math.tan(AngleHelper.radiusToDegrees(orientationAngle));
    const q = yp - m*xp;


    var hitPlayers = [];

    for (const i in players) {
      const player = players[i];

      const angle = (this.getAngle(position, player.position) + 90)%360;
      const deg = this.angularDistance(orientationAngle, angle);
      const rad = AngleHelper.degreesToRadius(deg);

      // const lateralDistance = this.lateralDistance(player.position, m, q);
      const distance = this.pointDistance(position, player.position);
      const lateralDistance = Math.abs(distance * Math.sin(rad));
      const verticalDistance = Math.abs(distance * Math.cos(rad));


      // alert("player: " + player.username +
      //   "\nangle: " + angle +
      //   "\norientationAngle: " + orientationAngle +
      //   "\ndeg: " + deg +
      //   "\nlateral distance: " + lateralDistance +
      //   "\nvertical distance: " + verticalDistance);

      if (lateralDistance<this.maxLateralDistance && verticalDistance<this.maxVerticalDistance && deg<45) {
        hitPlayers.push(player);
      }
    }

    hitPlayers.forEach(p =>{
      alert(p.username);
      this.http.put('/matches/'+roomName+username+'/users/score',{score:100}).subscribe(
        data=>{
          this.http.put('/matches/'+roomName+p.username+'/users/score',{score:-100}).subscribe(
            data=>{

            },err =>{
              console.log(err);
            }
          )
        },err=>{
          console.log(err);
        }
      );
    });

    return hitPlayers;
  }

  private getAngle(centralPosition, position) {
    const atan = Math.atan2(CoordinatesHelper.longitudeDistanceInMeters(centralPosition.longitude, position.longitude, centralPosition.latitude),
      CoordinatesHelper.latitudeDistanceInMeters(centralPosition.latitude, position.latitude));
    return (AngleHelper.radiusToDegrees(atan)+180) | 0;
  }

  private angularDistance(alpha, beta) {
    const phi = Math.abs(beta - alpha) % 360;       // This is either the distance or 360 - distance
    const  distance = phi > 180 ? 360 - phi : phi;
    return distance;
  }

  private lateralDistance(point: Point, m: number, q: number): number {
    //mettere curvatura terrestre
    const num = Math.abs(q + point.longitude * m - point.latitude);
    const den = Math.sqrt(1 + Math.pow(m, 2));
    return num/den * CoordinatesHelper.unitDegreeLongitudeLength(point.latitude);
  }

  private verticalDistance(sourcePoint: Point, point: Point, lateralDistance: number): number {
    const hypotenuse = this.pointDistance(sourcePoint, point);
    const c2 = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(lateralDistance, 2));
    // alert("hypotenuse = " + hypotenuse + "\nc1 = " + lateralDistance + "\nc2 = " + c2);
    return c2;
  }

  private pointDistance(fromPoint: Point, toPoint: Point): number {
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

