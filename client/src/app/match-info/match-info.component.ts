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

  match: Match;
  usersSub: Subscription;
  timeoutSub: Subscription;
  users: Array<String> = [];
  matchState: MatchState;
  password;
  remainingTime;

  intervalId;

  constructor(private router: Router,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.match = LocalStorageHelper.getItem(StorageKey.MACTH);
    this.matchState = this.match.state;
    this.dataService.joinRoom(this.match.name,"Diego"+Math.random());
    this.users = this.match.users;

    this.intervalId = setInterval(()=> {
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
        console.log(this.users[0]);
        console.log(this.users);
      });
    this.timeoutSub = this.dataService
      .getTimeouts()
      .subscribe( timeouts =>{
          switch (timeouts) {
            case "STARTED":
              console.log("Started")
              this.matchState = MatchState.STARTED;
              if(this.users.includes(LocalStorageHelper.getItem(StorageKey.USERNAME))) {
                this.router.navigateByUrl("match");
              }
              break;
            case "ENDED":
              console.log("Ended")
              this.matchState = MatchState.ENDED;
              break;
          }
        });
  }

  ngOnDestroy() {
    LocalStorageHelper.removeItem(StorageKey.MACTH)
  }

  checkUserInside() {
    if (this.matchState === MatchState.STARTED) {
      if(this.users.includes(LocalStorageHelper.getItem(StorageKey.USERNAME))) {
        this.router.navigateByUrl("match");
      }
    }
  }

  updateCountdown() {

    const startingTime = new Date(this.match.startingTime);
    const now = new Date();

    var date: Date;
    if (this.matchState === MatchState.SETTING_UP) {
      date = DateHelper.dateDifference(startingTime, now);

      if (date && date.getSeconds() > 0) {
        this.remainingTime = date.getMinutes() + ":" + date.getSeconds();
      } else {
        this.remainingTime = "00:00"
      }

    } else if (this.matchState === MatchState.STARTED) {
      const newDate = new Date(startingTime.getTime()+this.match.duration*60000);
      date = DateHelper.dateDifference(newDate, now);

      if (date && date.getSeconds() > 0) {
        this.remainingTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      } else {
        this.remainingTime = "00:00:00"
        clearInterval(this.intervalId);
      }

    } else {
      clearInterval(this.intervalId);
    }



  }

  showPassword() {
    return this.match.access===MatchAccess.PRIVATE;
  }

  showRemainingTime() {
    return this.match.state !== MatchState.ENDED;
  }

  join() {

    const body = {
      username: LocalStorageHelper.getItem(StorageKey.USERNAME),
      password: this.password
    };

    this.http.post("/api/matches/" + this.match.name + "/users", body).subscribe(
      data => {
        this.checkUserInside()
      }, error => {
        console.log(error)
      }
    )
  }
  
}
