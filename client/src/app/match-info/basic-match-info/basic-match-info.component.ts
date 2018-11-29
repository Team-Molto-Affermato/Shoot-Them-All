import { Component, OnInit } from '@angular/core';
import {Match, MatchAccess, MatchOrganization, MatchState} from "../../../models/match";
import {Subscription} from "rxjs";
import {none, Option, some} from "ts-option";
import {Team} from "../../../models/team";
import {SpinnerOption} from "../match-info.component";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../../services/data.service";
import {LocalStorageHelper, StorageKey} from "../../../utilities/LocalStorageHelper";
import {DateHelper} from "../../../utilities/DateHelper";

@Component({
  selector: 'app-basic-match-info',
  templateUrl: './basic-match-info.component.html',
  styleUrls: ['./basic-match-info.component.scss']
})
export class BasicMatchInfoComponent implements OnInit {
  users: Array<String> = [];
  usersSub: Subscription;

  match: Match;
  username: string;
  savedPassword:string;
  timeoutSub: Subscription;
  remainingTime;
  team: Option<Team> = none;
  spinnerOption:SpinnerOption;
  teamVisible = false;
  countdownIntervalId;

  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();
    const savedData = LocalStorageHelper.getItem(StorageKey.MATCH_PASSWORD);
    if(this.match.access === MatchAccess.PRIVATE) {
      if ((this.match.password === savedData.password) && (this.match.name === savedData.matchName)) {
        this.savedPassword = savedData.password;
      }
    }
    this.users = this.match.users;
    this.usersSub = this.dataService
      .getUsers()
      .subscribe(userList => {
        console.log(userList);
        this.users = userList;
        // this.checkUserInside();
        console.log(this.users[0]);
        console.log(this.users);
      });
    this.dataService.joinRoom(this.match.name,this.username);
    this.teamVisible = this.match.organization === MatchOrganization.TEAM;
    if (this.teamVisible) {
      this.team = some(Team.TEAM1);
    }
    this.countdownIntervalId = setInterval(()=> {
        this.updateCountdown();
      },
      1000);
    this.updateCountdown();
    this.timeoutSub = this.dataService
      .getTimeouts()
      .subscribe( timeouts =>{
        switch (timeouts) {
          case "STARTED":
            console.log("Started")
            this.match.state = MatchState.STARTED;
            break;
          case "ENDED":
            console.log("Ended")
            this.match.state = MatchState.ENDED;
            break;
        }
        this.setSpinnerOption();
      });

    this.setSpinnerOption();
  }
  private printState():string{
    switch (this.match.state) {
      case MatchState.SETTING_UP:
        return "Waiting to start the match";
      case MatchState.STARTED:
        return "The match is started";
      case MatchState.ENDED:
        return "The match is ended";
    }
  }
  private setSpinnerOption(){
    this.spinnerOption = new SpinnerOption(
      this.getSpinnerColor(),
      "determinate",
      this.getElapsedPercentage()
    );
  }
  private getElapsedPercentage():number{
    const now = new Date();
    if(this.match.state === MatchState.SETTING_UP){
      const difference = DateHelper.dateDifference(this.match.startingTime, now);
      if (difference && difference>0) {
        return ((60000-difference)/60000)*100;
      }else{
        return 100;
      }
    }else{
      const endingDate = new Date(this.match.startingTime.getTime()+this.match.duration*60000);
      const remaining = DateHelper.dateDifference(endingDate, now)/60000;
      return ((this.match.duration-remaining)/this.match.duration)*100;
    }
  }
  private getSpinnerColor():String {
    switch (this.match.state) {
      case MatchState.SETTING_UP:
        return "primary";
      case MatchState.STARTED:
        return "accent";
      case MatchState.ENDED:
        return "warn";
    }
  }
  ngOnDestroy() {
    clearInterval(this.countdownIntervalId);
    // this.dataService.leaveRoom(this.match.name);
  }

  updateCountdown() {

    const now = new Date();
    var difference: number;
    this.setSpinnerOption();
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


  switchTeam() {
    if (this.teamVisible) {
      if (this.team.get === Team.TEAM1) {
        this.team = some(Team.TEAM2);
      } else {
        this.team = some(Team.TEAM1);
      }
    }
  }
  showRemainingTime() {
    return this.match.state !== MatchState.ENDED;
  }
  showJoin() {
    return this.match.state !== MatchState.ENDED;
  }
  private userJoined(): boolean {
    return this.users.includes(this.username);
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
      const teamV = this.team.isDefined?this.team.get:"NONE";
      var body = {
        username: this.username,
        password: this.savedPassword,
        team : teamV,
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
