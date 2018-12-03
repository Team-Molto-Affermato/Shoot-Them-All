import { Component, OnInit } from '@angular/core';
import {MatchComponent} from "../../match.component";
import {HttpClient} from "@angular/common/http";
import {Match} from "../../../../models/match";
import {LocalStorageHelper, StorageKey} from 'src/utilities/LocalStorageHelper';
import {Subscription} from "rxjs";
import {DataService} from "../../../../services/data.service";
import {ConditionUpdaterService} from "../../../../services/condition-updater.service";
import {UserScore} from "../../../../models/user";
import {UserPosition} from "../../../../models/point";

@Component({
  selector: 'app-earth-map',
  templateUrl: './earth-map.component.html',
  styleUrls: ['./earth-map.component.css']
})
export class EarthMapComponent implements OnInit {
  match: Match;
  positionOfUser;
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
    this.positionOfUser = this.conditionObserverService.position;
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
        console.log("Mappa dati socket: ",positions);
        this.userPositions = [];
        positions.forEach(pos=>{
          if (pos.username !== username) {
            this.userPositions.push(pos);
          }
        });
      });
  }
}
