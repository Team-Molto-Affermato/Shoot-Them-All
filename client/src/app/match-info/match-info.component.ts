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

  constructor(private router: Router,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.match = LocalStorageHelper.getItem(StorageKey.MACTH);
    this.matchState = this.match.state;
    this.dataService.joinRoom(this.match.name,"Diego"+Math.random());
    this.users = this.match.users;

    const startingTime = new Date(this.match.startingTime);
    const now = new Date();

    var date: Date;
    if (this.match.state === MatchState.SETTING_UP) {
      date = DateHelper.dateDifference(startingTime, now)
    } else if (this.match.state === MatchState.STARTED) {
      const newDate = new Date(startingTime.getTime()+this.match.duration*60000);
      date = DateHelper.dateDifference(newDate, now);
    }

    this.remainingTime = date.getSeconds();

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
              this.matchState = MatchState.STARTED;
              if(this.users.includes(LocalStorageHelper.getItem(StorageKey.USERNAME))) {
                this.router.navigateByUrl("match");
              }
              break;
            case "ENDED":
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
