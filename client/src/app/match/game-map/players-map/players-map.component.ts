import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Match, MatchOrganization} from "../../../../models/match";
import {LocalStorageHelper, StorageKey} from 'src/utilities/LocalStorageHelper';
import {Subscription} from "rxjs";
import {DataService} from "../../../../services/data.service";
import {ConditionUpdaterService} from "../../../../services/condition-updater.service";
import {Point, UserPosition} from "../../../../models/point";
import {Role} from "../../../../models/RoleHelper";
import {Team} from "../../../../models/team";

@Component({
  selector: 'app-players-map',
  templateUrl: './players-map.component.html',
  styleUrls: ['./players-map.component.css']
})
export class PlayersMapComponent implements OnInit, OnDestroy {
  match: Match;
  positionOfUser;
  teamVisible:boolean = false;
  positionAvailable:boolean;
  userPositions:Array<UserPosition>;
  styles;
  usersSub:Subscription;
  constructor(private dataService:DataService,
              private conditionObserverService: ConditionUpdaterService,
              private http: HttpClient) {

  }

  ngOnInit() {
    const username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.match = LocalStorageHelper.getCurrentMatch();
    this.teamVisible = this.match.organization === MatchOrganization.TEAM;

    this.positionAvailable = LocalStorageHelper.getItem(StorageKey.COMPLETE_FUNCTIONALITIES);
    this.positionOfUser = this.positionAvailable?
      this.conditionObserverService.position:
      new Point(0,0);
    this.http.get("../../../../assets/styles/earthMapStyles.json").subscribe(
      data => {
        this.styles = data;
      }, error => {
        console.log(error)
      }
    )
    this.http.get('api/matches/'+this.match.name+'/users/positions').subscribe(
      (data: Array<UserPosition>)=>{
        this.userPositions = data;
        console.log("Mappa dati get: ",data);
      },err =>{
        console.log(err);
      });
    this.usersSub = this.dataService
      .getPositions()
      .subscribe(positions =>{
        const newPositions = [];
        positions.forEach(pos=>{
          if (pos.username !== username) {
            newPositions.push(pos);
          }
        });
        // console.log("Mappa dati socket: ",positions);
        if(!(this.userPositions===newPositions)){
          this.userPositions = newPositions;
        }
      });
  }
  getTeam(team:Team):string{
    return team===Team.TEAM1?"Jedi":"Sith";
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
