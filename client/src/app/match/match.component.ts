import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Coordinate, CoordinatesHelper} from "../../utilities/CoordinatesHelper";
import {AngleHelper} from "../../utilities/AngleHelper";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
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
export class MatchComponent implements OnInit {

  centerCoordinate = new Coordinate(43.688756, 12.954835);

  points = [{coordinate: new Coordinate(43.688632, 12.953757), active: false},
            {coordinate: new Coordinate(43.688841, 12.955377), active: false}];
  deg: number = 0;
  radius: number = 100;
  ratio: number;
  usersSub: Subscription;
  userScoreSub: Subscription;
  radar: HTMLElement;

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.radar = document.getElementById("rad");
    const radarRadius = this.radar.offsetWidth/2;
    this.ratio = radarRadius/this.radius;
    this.usersSub = this.dataService
      .getPositions()
      .subscribe(pos =>{
        console.log(pos);
        let newPos = {coordinate: new Coordinate(pos.position.x, pos.position.y), active: false};
        this.points.push(newPos);
        console.log(this.points);
      });
    this.userScoreSub = this.dataService
      .getScores()
      .subscribe(score=>{
        console.log(score);
      });

    window.addEventListener("deviceorientationabsolute", (event) => this.handleOrientation(event), true)

    setInterval(() => this.rotate(), 25);

  }

  rotate() {
    this.radar.style.transform = 'rotate(' + this.deg + 'deg)';
    const radarRadius = this.radar.offsetWidth/2;
    this.ratio = radarRadius/this.radius;

    this.points.forEach(p => {

      const atan = Math.atan2((this.longitudeDistanceFromCenter(p.coordinate.longitude))*this.ratio,
        (this.latitudeDistanceFromCenter(p.coordinate.latitude))*this.ratio);
      const deg = (AngleHelper.radiusToDegrees(-atan)+180) | 0;


      p.active = this.deg === deg;
    });

    this.deg = ++this.deg%360;
  }

  calculatePosition(point) {
    const radarRadius = this.radar.offsetWidth/2;
    return {
      left: (this.longitudeDistanceFromCenter(point.coordinate.longitude) + this.radius) * this.ratio + 'px',
      top: (this.latitudeDistanceFromCenter(point.coordinate.latitude) + this.radius) * this.ratio + 'px'
    }
  }

  private longitudeDistanceFromCenter(longitude) {
    return CoordinatesHelper.longitudeDistanceInMeters(this.centerCoordinate.longitude, longitude,
      this.centerCoordinate.latitude)
  }

  private latitudeDistanceFromCenter(latitude) {
    return CoordinatesHelper.latitudeDistanceInMeters(this.centerCoordinate.latitude, latitude)
  }

  private handleOrientation(event) {
    var absolute: boolean = event.absolute;
    var alpha: number    = event.alpha;
    var beta: number     = event.beta;
    var gamma: number    = event.gamma;

    if (beta>90 || beta<-90) {
      alpha=Math.abs(alpha+180)%360;
    }

    alpha = Math.round(alpha);

    document.getElementById('container').style.transform = 'rotate(' + -alpha + 'deg)';
  }

  shoot() {
  }
}
