import {Component, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CoordinatesHelper} from "../../utilities/CoordinatesHelper";
import {AngleHelper} from "../../utilities/AngleHelper";
import {DataService} from "../../services/data.service";
import {Subscription} from "rxjs";
import {MotionSensors} from "../../assets/motion-sensors.js"
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {Match} from "../../models/match";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CollisionsDetectionService} from "../../services/collision-detection.service";
import {Point} from "../../models/point";

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
export class MatchComponent implements OnInit, OnDestroy {

  username: string;
  match: Match;

  position: Point;

  players = [];

  sensor = null;
  orientationAngle: number = 0;
  timeoutSub: Subscription;
  deg: number = 0;
  radius: number = 100;
  ratio: number;
  usersSub: Subscription;
  userScoreSub: Subscription;
  radar: HTMLElement;

  rotateIntervalId;
  positionIntervalId;

  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private collisionDetectionService: CollisionsDetectionService
  ) {
  }

  ngOnInit() {
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();

    this.dataService.joinRoom(this.match.name,this.username);

    this.radar = document.getElementById("rad");
    const radarRadius = this.radar.offsetWidth/2;
    this.ratio = radarRadius/this.radius;

    this.getPosition();

    this.usersSub = this.dataService
      .getPositions()
      .subscribe(positions =>{
        console.log(positions);
        //Sarebbe da fare clear
        this.players = [];
        positions.forEach(pos=>{
          let newPos = {userPosition: pos, active: false};
          this.players.push(newPos);
        });
      });
    this.userScoreSub = this.dataService
      .getScores()
      .subscribe(score=>{
        console.log(score);
      });
    this.timeoutSub = this.dataService
      .getTimeouts()
      .subscribe( timeouts =>{
        switch (timeouts) {
          case "ENDED":
            console.log("Ended")
            this.router.navigateByUrl("/home");
            break;
        }
      });

    window.addEventListener("deviceorientationabsolute", (e) => this.handleOrientation(e));

    // createSensor((q) => this.updateOrientation(q), (e) => {this.handleError(e)})

    this.rotateIntervalId = setInterval(() => this.rotate(), 25);

    this.positionIntervalId = setInterval(() => this.getPosition(), 500);

  }

  ngOnDestroy(): void {
    clearInterval(this.rotateIntervalId);
    clearInterval(this.positionIntervalId);
    this.dataService.leaveRoom(this.match.name);
  }

  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => this.updatePosition(pos),
        error => console.log(error),
        {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
    }
  }

  updatePosition(position) {


    this.position = new Point(position.coords.longitude, position.coords.latitude);

    const body = {
      location: {
        type: "Point",
        coordinates: [this.position.x, this.position.y]
      },
    };

    this.http.put("/api/matches/" + this.match.name + "/" + this.username + "/pos", body).subscribe(
      data => {

      },
      error => {
        console.log(error)
      }
    )
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

    this.players.forEach(p => {

      const atan = Math.atan2((this.longitudeDistanceFromCenter(p.userPosition.position.x))*this.ratio,
        (this.latitudeDistanceFromCenter(p.userPosition.position.y))*this.ratio);
      const deg = (AngleHelper.radiusToDegrees(-atan)+180) | 0;


      p.active = this.deg === deg;
    });

    this.deg = ++this.deg%360;
  }

  calculatePosition(position) {

    return {
      left: (this.longitudeDistanceFromCenter(position.x) + this.radius) * this.ratio + 'px',
      top: (this.latitudeDistanceFromCenter(position.y) + this.radius) * this.ratio + 'px'
    }
  }

  private longitudeDistanceFromCenter(longitude) {
    return CoordinatesHelper.longitudeDistanceInMeters(this.position.x, longitude,
      this.position.y)
  }

  private latitudeDistanceFromCenter(latitude) {
    return CoordinatesHelper.latitudeDistanceInMeters(this.position.y, latitude)
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
    this.collisionDetectionService.checkCollisions(this.position, this.orientationAngle, this.players.map(u => u.userPosition));
  }

  exit() {
    this.http.delete("/api/matches/" + this.match.name + "/users/" + this.username).subscribe(
      data => {
        this.router.navigateByUrl("/home");
      }, error => {
        console.log(error)
      }
    )
  }

}
