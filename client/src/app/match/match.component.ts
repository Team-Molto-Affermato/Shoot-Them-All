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
import {UserInMatch, UserScore} from "../../models/user";
import {CoordinatesHelper} from "../../utilities/CoordinatesHelper";
import {GameMap} from "../../models/GameMap";
import {Option, some} from "ts-option";

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit, OnDestroy {
  showLeaderboard = false;
  match: Match;
  userInMatch: UserInMatch;

  orientationAngle;
  players = [];
  userInArea = true;

  gameMap: Option<GameMap>;

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
    const username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();

    this.userInMatch = new UserInMatch(username, new Point(0,0), 100);

    this.http.get('api/matches/'+this.match.name+'/users/score').subscribe(
      (data: Array<UserScore>)=>{
        data.forEach(score =>{
          if(score.username === this.userInMatch.username){
            this.userInMatch.score = Number(score.score);
          }
        });
      },err =>{
        console.log(err);
      });

    this.dataService.joinRoom(this.match.name, username);


    this.getPosition();

    this.usersSub = this.dataService
      .getPositions()
      .subscribe(positions =>{
        this.players = [];
        positions.forEach(pos=>{
          if (pos.username !== this.userInMatch.username) {
            this.players.push(pos);
          }
        });
      });
    this.userScoreSub = this.dataService
      .getScores()
      .subscribe(score=>{
        score.forEach(score =>{
          if(score.username === this.userInMatch.username){
            this.updateScore(Number(score.score));
          }
        });
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

    this.userInMatch.position = new Point(position.coords.latitude, position.coords.longitude);
    this.userInArea = CoordinatesHelper.pointDistance(this.userInMatch.position, this.match.centralPoint) < this.match.radius;

    this.gameMap.map((g) => g.updatePosition(this.userInArea));

    const body = {
      location: {
        type: "Point",
        coordinates: [this.userInMatch.position.latitude, this.userInMatch.position.longitude]
      },
    };

    this.http.put("/api/matches/" + this.match.name + "/" + this.userInMatch.username + "/pos", body).subscribe(
      data => {

      },
      error => {
        console.log(error)
      }
    )
  }

  private handleOrientation(event) {
    var absolute: boolean = event.absolute;
    var alpha: number    = event.alpha;
    var beta: number     = event.beta;
    var gamma: number    = event.gamma;

    if (alpha) {
      if (beta>90 || beta<-90) {
        alpha=Math.abs(alpha+180)%360;
      }

      alpha = Math.round(alpha);

      this.orientationAngle = (alpha+90)%360;

      const radar = document.getElementById('container');
      if (radar) {
        radar.style.transform = 'rotate(' + alpha + 'deg)';
      }
    }
  }

  updateScore(score: number) {
    if (score < this.userInMatch.score) {
      navigator.vibrate(200);
    }
    this.userInMatch.score = score;

  }

  shoot() {
    this.collisionDetectionService.checkCollisions(this.userInMatch.position, this.orientationAngle,
      this.players,this.match.name,this.userInMatch.username);
  }

  exit() {
    this.http.delete("/api/matches/" + this.match.name + "/users/" + this.userInMatch.username).subscribe(
      data => {
        this.router.navigateByUrl("/home");
      }, error => {
        console.log(error)
      }
    )
  }
  switchComponent() {
    this.showLeaderboard = !this.showLeaderboard;
  }
}
