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


    var hitPlayers = [];

    for (const i in players) {
      const player = players[i];

      const angle = (this.getAngle(position, player.position) + 90)%360;
      const deg = this.angularDistance(orientationAngle, angle);
      const rad = AngleHelper.degreesToRadius(deg);


      const distance = CoordinatesHelper.pointDistance(position, player.position);
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
      this.http.put('api/matches/'+roomName+'/'+username+'/score',{score:100}).subscribe(
        data=>{
          this.http.put('api/matches/'+roomName+'/'+p.username+'/score',{score:-100}).subscribe(
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
    const atan = Math.atan2(CoordinatesHelper.longitudeSignedDistanceInMeters(centralPosition.longitude, position.longitude, centralPosition.latitude),
      CoordinatesHelper.latitudeSignedDistanceInMeters(centralPosition.latitude, position.latitude));
    return (AngleHelper.radiusToDegrees(atan)+180) | 0;
  }

  private angularDistance(alpha, beta) {
    const phi = Math.abs(beta - alpha) % 360;       // This is either the distance or 360 - distance
    const  distance = phi > 180 ? 360 - phi : phi;
    return distance;
  }
}

