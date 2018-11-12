import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatchComponent} from "../../match.component";
import {AngleHelper} from "../../../../utilities/AngleHelper";
import {CoordinatesHelper} from "../../../../utilities/CoordinatesHelper";

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
export class RadarComponent implements OnInit, OnDestroy {

  deg: number = 0;
  radius: number = 1000;
  ratio: number;
  radar: HTMLElement;

  rotateIntervalId;

  constructor(private matchComponent: MatchComponent) { }

  ngOnInit() {
    this.radar = document.getElementById("rad");
    const radarRadius = this.radar.offsetWidth/2;
    this.ratio = radarRadius/this.radius;

    this.rotateIntervalId = setInterval(() => this.rotate(), 25);
  }

  ngOnDestroy() {
    clearInterval(this.rotateIntervalId);
  }

  rotate() {
    this.radar.style.transform = 'rotate(' + this.deg + 'deg)';
    const radarRadius = this.radar.offsetWidth/2;
    this.ratio = radarRadius/this.radius;

    this.matchComponent.players.forEach(p => {

      const atan = Math.atan2((this.longitudeDistanceFromCenter(p.userPosition.position.longitude))*this.ratio,
        (this.latitudeDistanceFromCenter(p.userPosition.position.latitude))*this.ratio);
      const deg = (AngleHelper.radiusToDegrees(-atan)+180) | 0;

      p.active = this.deg === deg;
    });

    this.deg = ++this.deg%360;
  }

  getPlayers() {
    return this.matchComponent.players;
  }

  getPositionStyle(position) {
    return {
      left: (this.longitudeDistanceFromCenter(position.longitude) + this.radius) * this.ratio + 'px',
      top: (this.latitudeDistanceFromCenter(position.latitude) + this.radius) * this.ratio + 'px'
    }
  }

  showPlayerInfo(player) {
    alert(player.userPosition.username);
  }

  private longitudeDistanceFromCenter(longitude) {
    return CoordinatesHelper.longitudeDistanceInMeters(this.matchComponent.userInMatch.position.longitude, longitude,
      this.matchComponent.userInMatch.position.latitude)
  }

  private latitudeDistanceFromCenter(latitude) {
    return CoordinatesHelper.latitudeDistanceInMeters(this.matchComponent.userInMatch.position.latitude, latitude)
  }

}
