import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatchComponent} from "../../match.component";
import {AngleHelper} from "../../../../utilities/AngleHelper";
import {CoordinatesHelper} from "../../../../utilities/CoordinatesHelper";
import {GameMap} from "../../../../models/GameMap";
import {UserInMatch} from "../../../../models/user";
import {none, some} from "ts-option";

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css'],
  animations: [
    trigger('switch', [
      state('inactive', style({
        opacity: 0.2
      })),
      state('active', style({
        opacity: 1
      })),
      transition('inactive => active', [
        animate(1)
      ]),
      transition('active => inactive', [
        animate(1700)
      ])
    ])
  ]
})
export class RadarComponent implements GameMap, OnInit, OnDestroy {

  deg: number = 0;
  radius: number;
  ratio: number;
  radar_line: HTMLElement;

  activePoints = new Map<String, Boolean>();

  rotateIntervalId;

  radarStyle;

  constructor(readonly matchComponent: MatchComponent) {
    this.radius = this.matchComponent.match.radius;
    this.matchComponent.gameMap = some(this);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    clearInterval(this.rotateIntervalId);
    this.matchComponent.gameMap = none;
  }

  updatePosition(userInArea: boolean) {
    if (userInArea) {
      this.radar_line = document.getElementById("radar_line");
      const radarRadius = this.radar_line.offsetWidth/2;
      this.ratio = radarRadius/this.radius;

      this.radarStyle = {
        'background': '#222 url("../../../../assets/radar_enabled.png") no-repeat',
        'background-size': '40vh'
      };

      if (!this.rotateIntervalId){
        this.rotateIntervalId = setInterval(() => this.rotate(), 25);
      }
    } else {
      this.radarStyle = {
        'background': '#222 url("../../../../assets/radar_disabled.png") no-repeat',
        'background-size': '40vh'
      };

      if (this.rotateIntervalId) {
        clearInterval(this.rotateIntervalId);
        this.rotateIntervalId = null;
      }
    }
  }

  rotate() {
    this.radar_line.style.transform = 'rotate(' + this.deg + 'deg)';
    const radarRadius = this.radar_line.offsetWidth/2;
    this.ratio = radarRadius/this.radius;

    this.matchComponent.players.forEach(p => {

      const atan = Math.atan2((this.longitudeDistanceFromCenter(p.position.longitude))*this.ratio,
        (this.latitudeDistanceFromCenter(p.position.latitude))*this.ratio);
      const deg = (AngleHelper.radiusToDegrees(-atan)+180) | 0;

      this.activePoints.set(p.username, this.deg === deg);
    });

    this.deg = ++this.deg%360;
  }

  getPositionStyle(position) {
    return {
      left: (this.longitudeDistanceFromCenter(position.longitude) + this.radius) * this.ratio + 'px',
      top: (this.latitudeDistanceFromCenter(position.latitude) + this.radius) * this.ratio + 'px'
    }
  }

  showPlayerInfo(player) {
    alert(player.username);
  }

  private longitudeDistanceFromCenter(longitude) {
    return CoordinatesHelper.longitudeSignedDistanceInMeters(this.matchComponent.userInMatch.position.longitude, longitude,
      this.matchComponent.userInMatch.position.latitude)
  }

  private latitudeDistanceFromCenter(latitude) {
    return CoordinatesHelper.latitudeSignedDistanceInMeters(this.matchComponent.userInMatch.position.latitude, latitude)
  }

}
