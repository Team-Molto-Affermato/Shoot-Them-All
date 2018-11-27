import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Match, MatchAccess, MatchOrganization, MatchState} from "../../models/match";
import {DataService} from '../../services/data.service';
import {Subscription} from "rxjs";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {HttpClient} from "@angular/common/http";
import {DateHelper} from "../../utilities/DateHelper";
import {none, Option, some} from "ts-option";
import {Team} from "../../models/team";
import {UserInLeaderboard} from "../../models/user";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

export class SpinnerOption {
  constructor(
    public color:String,
    public mode:String,
    public value:number
  ){
  }
}
@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent implements OnInit, OnDestroy {
  unlockRoomForm: FormGroup;
  savedPassword:string;
  isVisible= false;
  topScore:number= 40000;
  username: string;
  match: Match;
  usersSub: Subscription;
  timeoutSub: Subscription;
  users: Array<String> = [];
  // password;
  remainingTime;
  team: Option<Team> = none;
  spinnerOption:SpinnerOption;
  teamVisible = false;
  countdownIntervalId;
  leaderBoardSub: Subscription;
  leaderboard: Array<UserInLeaderboard> = [];
  dataSource = new MatTableDataSource<UserInLeaderboard>(this.leaderboard);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.unlockRoomForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();
    const savedData = LocalStorageHelper.getItem(StorageKey.MATCH_PASSWORD);
    if(this.match.access === MatchAccess.PRIVATE){
     if((this.match.password === savedData.password)&&(this.match.name===savedData.matchName)){
       this.isVisible = true;
       this.savedPassword = savedData.password;
     }
    }else{
      this.isVisible = true;
    }
    this.dataService.joinRoom(this.match.name,this.username);
    this.users = this.match.users;

    this.teamVisible = this.match.organization === MatchOrganization.TEAM;

    if (this.teamVisible) {
      this.team = some(Team.TEAM1);
    }


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
          this.setSpinnerOption();
        this.dataSource.paginator = this.paginator;

      });

     this.setSpinnerOption();
  }
  private savePassword(){
    const insertedPassword = this.unlockRoomForm.value.password
    if(insertedPassword===this.match.password){
      LocalStorageHelper.setItem(
        StorageKey.MATCH_PASSWORD,
      {
        matchName: this.match.name,
        password: insertedPassword
      });
      this.isVisible = true;
    }
  }
  createFormGroup() {
    return this.formBuilder.group({
      username: '',
      password: ''
    });
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
    this.dataService.leaveRoom(this.match.name);
  }

  private checkUserInside() {
    if (this.match.state === MatchState.STARTED) {
      if(this.userJoined()) {
        this.router.navigateByUrl("/match");
      }
    }
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

  private userJoined(): boolean {
    return this.users.includes(this.username);
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
