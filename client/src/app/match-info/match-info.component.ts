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
import {drawParticles} from "../../assets/scripts/particles";
import Swiper from 'swiper';
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {Point} from "../../models/point";

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
  // isVisible = true;
  showPassword:boolean = false;
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
  swiper: Swiper;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);

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

  ngOnDestroy() {
    // clearInterval(this.countdownIntervalId);
    // this.dataService.leaveRoom(this.match.username);

  }


  ngAfterViewInit() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      loop: false,
      // spaceBetween: '20%',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

}
