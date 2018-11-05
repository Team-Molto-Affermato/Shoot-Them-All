import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Match, MatchAccess, MatchState} from "../../models/match";
import {DataService} from '../../services/data.service';
import {Subscription} from "rxjs";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {HttpClient} from "@angular/common/http";

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

  constructor(private router: Router,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.match = LocalStorageHelper.getItem(StorageKey.MACTH);
    this.matchState = this.match.state;
    this.dataService.joinRoom(this.match.name,"Diego"+Math.random());
    this.users = this.match.users;

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
            case "MATCH_START":
              this.matchState = MatchState.STARTED;
              if(this.users.includes(LocalStorageHelper.getItem(StorageKey.USERNAME))) {
                this.router.navigateByUrl("match");
              }
              break;
            case "MATCH_END":
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
    return this.match.access===MatchAccess.PRIVATE
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
