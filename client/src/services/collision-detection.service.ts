import { Injectable } from '@angular/core';
import {from} from "rxjs";
import {Point, UserPosition} from "../models/point";
import {CoordinatesHelper} from "../utilities/CoordinatesHelper";
import {AngleHelper} from "../utilities/AngleHelper";
import {DataService} from "./data.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CollisionsDetectionService {

  private maxLateralDistance = 10;
  private maxVerticalDistance = 100;

  constructor(
    private http:HttpClient
  ) { }

  checkCollisions(position: Point, orientationAngle: number, players: Array<UserPosition>,roomName:String,username:String) {

    const xp = position.longitude;
    const yp = position.latitude;
    const m = Math.tan(this.degFromRad(orientationAngle));
    const q = yp - m*xp;


    var hitPlayers = [];

    for (const i in players) {
      const player = players[i];

      const lateralDistance = this.lateralDistance(player.position, m, q);

      // alert("distance from " + player.username);
      // alert("lateral distance " + lateralDistance);

      if (lateralDistance < this.maxLateralDistance) {
        const verticalDistance = this.verticalDistance(position, player.position, lateralDistance);
        // alert("vertical distance " + verticalDistance);

        if (verticalDistance < this.maxVerticalDistance) {
          if (this.checkOrientation(position, player.position, orientationAngle)) {
            hitPlayers.push(player);
          }
        }
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

  private degFromRad(degrees) {
    return degrees * Math.PI/180;
  }

  private lateralDistance(point: Point, m: number, q: number): number {
    //mettere curvatura terrestre
    const num = Math.abs(point.latitude - (point.longitude * m + q));
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

