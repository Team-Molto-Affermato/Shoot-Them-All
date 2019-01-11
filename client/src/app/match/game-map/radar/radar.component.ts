import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatchComponent} from "../../match.component";
import {AngleHelper} from "../../../../utilities/AngleHelper";
import {CoordinatesHelper} from "../../../../utilities/CoordinatesHelper";
import {AbstractGameMap, GameMap} from "../../../../models/GameMap";
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
export class RadarComponent extends AbstractGameMap implements OnInit, OnDestroy, AfterViewInit {

  deg: number = 0;
  radius: number;
  ratio: number;
  radar_line: HTMLElement;

  viewInit: boolean = false;

  activePoints = new Map<String, Boolean>();

  rotateIntervalId;

  constructor(readonly matchComponent: MatchComponent) {
    super(matchComponent);
    this.radius = this.matchComponent.match.radius;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.rotate();
  }

  ngOnDestroy() {
    clearInterval(this.rotateIntervalId);
    this.matchComponent.gameMap = none;
  }

  updatePosition(userInArea: boolean) {
  }

  rotate() {
    if (this.matchComponent.userInArea) {

      if (!this.radar_line) {
        this.radar_line = document.getElementById("radar_line");
      }

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
    } else {
      if (this.radar_line) {
        this.radar_line = null;
      }
    }
    setTimeout(() => this.rotate(), 25);
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
