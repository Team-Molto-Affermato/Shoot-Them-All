import {Component, OnDestroy, OnInit} from '@angular/core';
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
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit, OnDestroy {

  username: string;
  match: Match;
  position: Point;
  score: number = 100;

  orientationAngle;
  players = [];

  timeoutSub: Subscription;
  usersSub: Subscription;
  userScoreSub: Subscription;

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
          console.log(pos);
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

    this.positionIntervalId = setInterval(() => this.getPosition(), 500);

  }

  ngOnDestroy(): void {
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

    this.position = new Point(position.coords.latitude, position.coords.longitude);

    const body = {
      location: {
        type: "Point",
        coordinates: [this.position.latitude, this.position.longitude]
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

  getScoreStyle() {
    return {
      width: this.score + '%'
    }
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

    this.orientationAngle = (alpha+90)%360;

    document.getElementById('container').style.transform = 'rotate(' + alpha + 'deg)';
  }

  calculateScore() {
    const self = this;

    var newScore = this.score - 30;
    if(newScore < 0) {
      newScore = 0;
    }

    const id = setInterval(() => f(), 10);

    function f() {
      if(self.score <= newScore) {
        clearInterval(id);
      } else {
        self.score--;
      }
    }
  }

  shoot() {
    this.collisionDetectionService.checkCollisions(this.position, this.orientationAngle, this.players.map(u => u.userPosition));

    this.calculateScore();
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
