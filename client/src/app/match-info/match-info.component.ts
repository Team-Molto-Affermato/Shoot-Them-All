import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatchInfoService} from "../../services/match-info.service";
import {Match} from "../../models/match";
import { DataService } from '../../services/data.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent implements OnInit {

  match: Match;
  usersSub: Subscription;
  timeoutSub: Subscription;
  users: Array<String> = new Array<String>();
  constructor(private router: Router,
              private matchInfoService: MatchInfoService,
              private dataService: DataService) {
    this.match = matchInfoService.getCurrentMatch();
  }

  ngOnInit() {
    this.dataService.joinRoom(this.match.name,"Diego"+Math.random())
    this.usersSub = this.dataService
      .getUsers()
      .subscribe(userList => {
        this.users = userList;
        console.log(this.users[0]);
        console.log(this.users);
      });
    this.timeoutSub = this.dataService
      .getTimeouts()
      .subscribe( timeouts =>{
          console.log(timeouts)
        });
  }
  
}
