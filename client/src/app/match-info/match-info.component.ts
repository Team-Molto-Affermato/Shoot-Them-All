import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Match} from "../../models/match";
import { DataService } from '../../services/data.service';
import {Subscription} from "rxjs";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";

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
  constructor(private router: Router,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.match = LocalStorageHelper.getItem(StorageKey.MACTH);
    this.dataService.joinRoom(this.match.name,"Diego"+Math.random());
    this.users = this.match.users;
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
          if(timeouts==="MATCH_START"){
            this.router.navigateByUrl("match");
            console.log(timeouts);
          }
        });
  }

  ngOnDestroy() {
    LocalStorageHelper.removeItem(StorageKey.MACTH)
  }

  join() {
    this.router.navigateByUrl("match")
  }
  
}
