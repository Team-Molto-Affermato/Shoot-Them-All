import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Coordinate, CoordinatesHelper} from "../../utilities/CoordinatesHelper";
import {AngleHelper} from "../../utilities/AngleHelper";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import {MotionSensors} from "../../assets/motion-sensors.js"
import {createSensor} from "../../assets/device-orientation-sensor.js"

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

  sensor = null;
  orientationAngle: number = 0;

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
      .subscribe(positions =>{
        console.log(positions);
        //Sarebbe da fare clear
        positions.forEach(pos=>{
          let newPos = {coordinate: new Coordinate(pos.position.x, pos.position.y), active: false};
          this.points.push(newPos);
          console.log(this.points);
        });
      });
    this.userScoreSub = this.dataService
      .getScores()
      .subscribe(score=>{
        console.log(score);
      });

    window.addEventListener("deviceorientationabsolute", (e) => this.handleOrientation(e));

    // createSensor((q) => this.updateOrientation(q), (e) => {this.handleError(e)})

    setInterval(() => this.rotate(), 25);

  }

  updateOrientation(q) {

    // // roll (x-axis rotation)
    const sinr_cosp = +2.0 * (q.w * q.x + q.y * q.z);
    const cosr_cosp = +1.0 - 2.0 * (q.x * q.x + q.y * q.y);
    var roll = Math.atan2(sinr_cosp, cosr_cosp);
    //
    // pitch (y-axis rotation)
    const sinp = 2.0 * (q.w * q.y - q.z * q.x);
    var pitch;
    if (Math.abs(sinp) >= 1)
        pitch = (Math.PI / 2) * Math.sign(sinp); // use 90 degrees if out of range
    else
        pitch = Math.asin(sinp);

    // yaw (z-axis rotation)
    const siny_cosp = 2.0 * (q.w * q.z + q.x * q.y);
    const cosy_cosp = 1.0 - 2.0 * (q.y * q.y + q.z * q.z);
    var yaw = Math.atan2(siny_cosp, cosy_cosp);

    roll = roll*180/Math.PI;
    pitch = pitch*180/Math.PI;
    yaw = yaw*180/Math.PI;
    if (yaw < 0) {
      yaw = yaw + 360;
    }

    roll = Math.round(roll);
    pitch = Math.round(pitch);
    yaw = Math.round(yaw);

    this.orientationAngle = yaw;

    if (roll>90 || roll<-90) {
      this.orientationAngle=Math.abs(yaw+180)%360;
    }

    document.getElementById('container').style.transform = 'rotate(' + this.orientationAngle + 'deg)';
  }

  handleError(e) {
    alert(e)
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

    this.orientationAngle = alpha;

    document.getElementById('container').style.transform = 'rotate(' + alpha + 'deg)';
  }

  shoot() {
  }
}
