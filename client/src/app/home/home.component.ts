import {Component, OnDestroy, OnInit,ViewChild,ChangeDetectorRef} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match, MatchState} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from '../../services/data.service';
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {AbstractObserverComponent} from "../ObserverComponent";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends AbstractObserverComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'state', 'access'];
  matches: Array<Match> = [];
  dataSource = new MatTableDataSource<Match>(this.matches);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showleaderboard = false;
  showMap =false;
  username;
  matchesSub: Subscription;
  constructor(private authenticationService: AuthenticationService,
              private homeService: HomeService,
              private dataService: DataService,
              router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }

  switchComponent() {
    this.showleaderboard = !this.showleaderboard;
  }

  ngOnInit() {
    this.matchesSub = this.dataService
      .getMatches()
      .subscribe(matches=>{
        alert("CIao");
        console.log("Che palle");
        this.matches = matches;
        console.log(this.matches);
        this.refresh();
      });
    this.init();
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.dataService.sendMessage();
    this.updateMatches();
    this.dataSource.paginator = this.paginator;
  }

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
        this.refresh();
      },
      error => alert(error)
    );
  }
   refresh() {
    this.dataSource.data = this.matches;
  };

  showInfo(match: Match) {
    LocalStorageHelper.setItem(StorageKey.MACTH, match);

    if (this.userJoined(match)) {
      this.router.navigateByUrl("/match");
    } else {
      this.router.navigateByUrl("/matchInfo");
    }
  }

  userJoined(match: Match): boolean {
    return (match.state === MatchState.STARTED) &&
      match.users.includes(this.username)
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
