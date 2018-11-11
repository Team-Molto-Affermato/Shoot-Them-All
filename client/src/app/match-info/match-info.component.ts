import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Match, MatchAccess, MatchState} from "../../models/match";
import {DataService} from '../../services/data.service';
import {Subscription} from "rxjs";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {HttpClient} from "@angular/common/http";
import {DateHelper} from "../../utilities/DateHelper";

@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent implements OnInit, OnDestroy {

  username: string;
  match: Match;
  usersSub: Subscription;
  timeoutSub: Subscription;
  users: Array<String> = [];
  password;
  remainingTime;

  countdownIntervalId;

  constructor(private router: Router,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();
    this.dataService.joinRoom(this.match.name,this.username);
    this.users = this.match.users;

    this.countdownIntervalId = setInterval(()=> {
      this.updateCountdown();
      },
      1000);

    this.updateCountdown();

    this.checkUserInside();

    this.usersSub = this.dataService
      .getUsers()
      .subscribe(userList => {
        console.log(userList);
        this.users = userList;
        this.checkUserInside();
        console.log(this.users[0]);
        console.log(this.users);
      });
    this.timeoutSub = this.dataService
      .getTimeouts()
      .subscribe( timeouts =>{
          switch (timeouts) {
            case "STARTED":
              console.log("Started")
              this.match.state = MatchState.STARTED;
              this.checkUserInside()
              break;
            case "ENDED":
              console.log("Ended")
              this.match.state = MatchState.ENDED;
              break;
          }
        });
  }

  ngOnDestroy() {
    clearInterval(this.countdownIntervalId);
    this.dataService.leaveRoom(this.match.name);
  }

  checkUserInside() {
    if (this.match.state === MatchState.STARTED) {
      if(this.userJoined()) {
        this.router.navigateByUrl("/match");
      }
    }
  }

  updateCountdown() {

    const now = new Date();
    var difference: number;

    if (this.match.state === MatchState.SETTING_UP) {
      difference = DateHelper.dateDifference(this.match.startingTime, now);

      if (difference && difference>0) {
        this.remainingTime = this.outputTime(difference, false);
      }

    } else if (this.match.state === MatchState.STARTED) {
      const endingDate = new Date(this.match.startingTime.getTime()+this.match.duration*60000);
      difference = DateHelper.dateDifference(endingDate, now);

      if (difference && difference>0) {
        this.remainingTime = this.outputTime(difference, true);
      } else {
        clearInterval(this.countdownIntervalId);
      }

    } else {
      clearInterval(this.countdownIntervalId);
    }

  }

  userJoined(): boolean {
    return this.users.includes(this.username);
  }

  showPassword() {
    return this.match.access===MatchAccess.PRIVATE;
  }

  showRemainingTime() {
    return this.match.state !== MatchState.ENDED;
  }

  showJoin() {
    return this.match.state !== MatchState.ENDED;
  }

  partecipationButtonText() {
    if (this.userJoined()) {
      return "Exit"
    } else {
      return "Join"
    }
  }

  switchPartecipation() {
    const penality = 500;
    if (!this.userJoined()) {
      var body = {
        username: this.username,
        password: this.password,
        score: 0
      };
      if(this.match.state === MatchState.STARTED) {
        const now = new Date();
        const endingDate = new Date(this.match.startingTime.getTime()+this.match.duration*60000);
        const remaining = DateHelper.dateDifference(endingDate, now)/60000;
        console.log(remaining);
        body.score = -((this.match.duration-remaining)/this.match.duration)*penality;
        console.log(body.score);

      }
      this.http.post("/api/matches/" + this.match.name + "/users", body).subscribe(
        data => {
        }, error => {
          console.log(error)
        }
      )
    } else {
      this.http.delete("/api/matches/" + this.match.name + "/users/" + this.username).subscribe(
        data => {

        }, error => {
          console.log(error)
        }
      )
    }

  }


  outputTime(time: number, withHour: boolean): string {

    if (withHour) {
      var h = DateHelper.hoursFromTime(time)+"";
      if (h.length < 2) {
        h = "0" + h;
      }
    }

    var m = DateHelper.minutesFromTime(time)+"";
    if (m.length < 2) {
      m = "0" + m;
    }

    var s = DateHelper.secondsFromTime(time)+"";
    if (s.length < 2) {
      s = "0" + s;
    }

    return (withHour?(h + ":"):"") + m + ":" + s;
  }
  
}
