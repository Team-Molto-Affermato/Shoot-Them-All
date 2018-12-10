import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {UserInLeaderboard, UserScore} from "../../../models/user";
import {ConditionUpdaterService} from "../../../services/condition-updater.service";
import {Point} from "../../../models/point";
@Component({
  selector: 'app-basic-match-info',
  templateUrl: './basic-match-info.component.html',
  styleUrls: ['./basic-match-info.component.scss']
})
export class BasicMatchInfoComponent implements OnInit {
  selectedBorderStyle = '8px solid #00d51c';
  unselectedBorderStyle = '';
  selectedSize = '175px';
  normalSize = '175px';
  users: Array<String> = [];
  userScoreSub: Subscription;
  teamType = Team;
  match: Match;
  username: string;
  savedPassword:string;
  timeoutSub: Subscription;
  remainingTime;
  defaultTeam = Team.TEAM1
  team: Option<Team> = some(Team.TEAM1);
  spinnerOption:SpinnerOption;
  teamVisible = false;
  countdownIntervalId;
  innerWidth: any;
  spinnerSize: number;
  // @ViewChild('yoda') yoda:ElementRef;
  constructor(
    private router: Router,
    private http: HttpClient,
    private conditionObserverService: ConditionUpdaterService,
    private dataService: DataService,
    // private rd:Renderer2
  ) { }

  ngOnInit() {
    // this.rd.setStyle(this.yoda,'width','200px');
    // this.rd.setStyle(this.yoda,'height','200px');

    this.innerWidth = window.innerWidth;
    this.spinnerSize = Math.round(this.innerWidth*0.2);

    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();
    const savedData = LocalStorageHelper.getItem(StorageKey.MATCH_PASSWORD);
    this.dataService.joinRoom(this.match.name,this.username);

    if(this.match.access === MatchAccess.PRIVATE) {
      if ((this.match.password === savedData.password) && (this.match.name === savedData.matchName)) {
        this.savedPassword = savedData.password;
      }
    }
    this.http.get('api/matches/'+this.match.name+'/users/').subscribe(
      (data: Array<UserScore>)=>{
        console.log("utenti: ",data);
        this.users = data.map(user=>user.username);
        this.checkUserInside();
        console.log("users: ",this.users);
      },err =>{
        console.log(err);
      });
    this.userScoreSub = this.dataService
      .getScores()
      .subscribe(userList => {
        console.log(userList);
        this.users = userList.map(user=>user.username);
        this.checkUserInside();
        console.log(this.users[0]);
        console.log(this.users);
      });

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
            this.checkUserInside();
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
        return 100-((60000-difference)/60000)*100;
      }else{
        return 0;
      }
    }else if(this.match.state === MatchState.STARTED){
      const endingDate = new Date(this.match.startingTime.getTime()+this.match.duration*60000);
      const remaining = DateHelper.dateDifference(endingDate, now)/60000;
      return 100-((this.match.duration-remaining)/this.match.duration)*100;
    }else{
      return 100;
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
    // this.dataService.leaveRoom(this.match.username);
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
        this.remainingTime= this.outputTime(0,true);
        clearInterval(this.countdownIntervalId);
      }

    } else {
      this.remainingTime= this.outputTime(0,true);
      clearInterval(this.countdownIntervalId);
    }

  }


  switchTeam(team:Team) {
    if (this.teamVisible) {
      this.team = some(team);
    }
  }
  showRemainingTime() {
    return this.match.state !== MatchState.ENDED;
  }
  showJoin() {
    return this.match.state !== MatchState.ENDED;
  }
  private userJoined(): boolean {
    // console.log("Nella user join: ",this.users,this.username);
    return this.users.includes(this.username);
  }
  partecipationButtonText() {
    if (this.userJoined()) {
      return "Leave the battle"
    } else {
      return "Join the battle"
    }
  }
  switchPartecipation() {
    const penality = 500;
    if (!this.userJoined()) {
      const teamV = this.team.isDefined?this.team.get:"NONE";
      const positionAvailable:boolean = LocalStorageHelper.getItem(StorageKey.COMPLETE_FUNCTIONALITIES);
      var position = positionAvailable?
        this.conditionObserverService.position:
        new Point(43,12);
      const location = {
        type: 'Point',
        coordinates: [position.latitude,position.longitude]
      };
      var body = {
        username: this.username,
        password: this.savedPassword,
        team : teamV,
        score: 0,
        location: location
      };
      if(this.match.state === MatchState.STARTED) {
        const now = new Date();
        const endingDate = new Date(this.match.startingTime.getTime()+this.match.duration*60000);
        const remaining = DateHelper.dateDifference(endingDate, now)/60000;
        console.log(remaining);
        body.score = Math.floor(-((this.match.duration-remaining)/this.match.duration)*penality);
        console.log(body.score);
      }
      this.http.post("/api/matches/" + this.match.name + "/users", body).subscribe(
        data => {
          console.log(data);
          this.checkUserInside();
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
  private checkUserInside() {
    console.log("Stato check: ",this.match.state,this.userJoined())
    if (this.match.state === MatchState.STARTED) {
      if(this.userJoined()) {
        this.router.navigateByUrl("/match");
      }
    }
  }
}
