import {Component, OnInit, ViewChild} from '@angular/core';
import {HomeService} from "../../../services/home.service";
import {DataService} from "../../../services/data.service";
import {Match, MatchAccess, MatchState} from "../../../models/match";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Subscription} from "rxjs";
import {LocalStorageHelper, StorageKey} from "../../../utilities/LocalStorageHelper";
import {Router} from "@angular/router";

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
              private dataService: DataService) {

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
    this.dataSource.paginator = this.paginator;
  }
  refresh() {
    this.dataSource.data = this.matches;
  };
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

    if (this.userJoined(match)) {
      this.router.navigateByUrl("/match");
    } else {
      this.router.navigateByUrl("/matchInfo");
    }
  }
  userJoined(match: Match): boolean {
    // return (match.state === MatchState.STARTED) &&
    //   match.users.includes(this.username)
    return false;
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
}
