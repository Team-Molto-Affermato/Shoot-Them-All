import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../../services/home.service";
import {DataService} from "../../../services/data.service";
import {Match, MatchAccess, MatchState} from "../../../models/match";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Subscription} from "rxjs";
import {LocalStorageHelper, StorageKey} from "../../../utilities/LocalStorageHelper";
import {Router} from "@angular/router";
import {CoordinatesHelper} from "../../../utilities/CoordinatesHelper";
import {ConditionUpdaterService} from "../../../services/condition-updater.service";
import {Point} from "../../../models/point";

@Component({
  selector: 'app-matches-list',
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.scss']
})
export class MatchesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'state', 'access'];
  matches: Array<Match> = [];
  username;
  dataSource = new MatTableDataSource<Match>(this.matches);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  matchesSub: Subscription;

  constructor(private homeService: HomeService,
              private router: Router,
              private dataService: DataService,
              private conditionObserverService: ConditionUpdaterService) {

  }

  ngOnInit() {
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.matchesSub = this.dataService
      .getMatches()
      .subscribe(matches=>{
        this.matches = matches;
        console.log(this.matches);
        this.refresh();
      });
    this.dataService.sendMessage();
    this.updateMatches();
    this.dataSource.filterPredicate = (data, filter) => {
      console.log("Filtro: ",filter, filter.charAt(0));
      if(filter!=="R" && filter!=="N"){
        if(filter.charAt(0) === 'N'){
          console.log("Per nome");
          return data.name.toLowerCase().startsWith(filter.slice(1).trim().toLowerCase());
        }else{
          const number = filter.slice(1);
          console.log(number);
          const range = Number(filter.slice(1));
          console.log("Per range: ",range);
          const positionAvailable:boolean = LocalStorageHelper.getItem(StorageKey.COMPLETE_FUNCTIONALITIES);
          var position = positionAvailable?
            this.conditionObserverService.position:
            new Point(43,12);
          return CoordinatesHelper.pointDistance(position,data.centralPoint)<range;
        }
      }else{
        return true;
      }
      // return data.name === filter
    }
      this.dataSource.paginator = this.paginator;
  }

  refresh() {
    this.dataSource.data = this.matches;
  }

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
        this.refresh();
      },
      // error => alert(error)
    );
  }

  showInfo(match: Match) {
    LocalStorageHelper.setItem(StorageKey.MACTH, match);
    this.router.navigateByUrl("/matchInfo");
  }

  getMatchState(state:MatchState):string{
    switch (state) {
      case MatchState.SETTING_UP : return "Setting Up";
      case MatchState.STARTED : return "Started";
      case MatchState.ENDED : return "Ended";
    }
  }
  getMatchAccess(access:MatchAccess):string{
    switch (access) {
      case MatchAccess.PRIVATE : return "Private";
      case MatchAccess.PUBLIC : return "Public";
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }
  applyFilterDistance(filterValue: number) {
    const positionAvailable:boolean = LocalStorageHelper.getItem(StorageKey.COMPLETE_FUNCTIONALITIES);
    var position = positionAvailable?
      this.conditionObserverService.position:
      new Point(43,12);
    const location = {
      type: 'Point',
      coordinates: [position.latitude,position.longitude]
    };
    this.dataSource.data = this.dataSource.data.filter(match=>{
      return CoordinatesHelper.pointDistance(position,match.centralPoint)<filterValue;
    });
    // this.dataSource.filter = "";
    console.log("Filter value: ",filterValue);
    console.log(this.dataSource.data);
      //CoordinatesHelper.pointDistance(new Point())
  }
}
