import { Injectable } from '@angular/core';
import {from} from "rxjs";
import {Point, UserPosition} from "../models/point";
import {CoordinatesHelper} from "../utilities/CoordinatesHelper";
import {AngleHelper} from "../utilities/AngleHelper";
import {HttpClient} from "@angular/common/http";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import {Team} from "../models/team";


@Injectable({
  providedIn: 'root'
})
export class CollisionsDetectionService {

  private maxLateralDistance = 20;
  private maxVerticalDistance = 500;

  constructor(
    private http:HttpClient,
    public snackBar: MatSnackBar
  ) { }

  checkCollisions(position: Point, orientationAngle: number, players: Array<UserPosition>,
                  roomName:String, username:String, teamMode: boolean, team: Team) {


    var hitPlayers = [];

    for (const i in players) {
      const player = players[i];

      const angle = (this.getAngle(position, player.position) + 90)%360;
      const deg = this.angularDistance(orientationAngle, angle);
      const rad = AngleHelper.degreesToRadius(deg);


      const distance = CoordinatesHelper.pointDistance(position, player.position);
      const lateralDistance = Math.abs(distance * Math.sin(rad));
      const verticalDistance = Math.abs(distance * Math.cos(rad));

      if (lateralDistance<this.maxLateralDistance && verticalDistance<this.maxVerticalDistance && deg<45) {
        if (!teamMode) {
          hitPlayers.push(player);
        } else {
          if (team !== player.team) {
            hitPlayers.push(player);
          } else {
            const config = new MatSnackBarConfig();
            this.snackBar.open("Friendly fire is not recommended", null, {
              duration: 1000
            });
          }
        }

      }
    }

    hitPlayers.forEach(p =>{
      const config = new MatSnackBarConfig();
      config.panelClass = ['background-red'];
      config.duration = 1000;
      this.snackBar.open("You hit "+p.username, null, config);
      //alert(p.username);
      this.http.put('api/matches/'+roomName+'/'+username+'/score',{score:100}).subscribe(
        data=>{
          this.http.put('api/matches/'+roomName+'/'+p.username+'/score',{score:-50}).subscribe(
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

