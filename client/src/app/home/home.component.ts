import {Component, OnDestroy, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match, MatchState} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from '../../services/data.service';
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {Subscription} from "rxjs";
import {AbstractObserverComponent} from "../ObserverComponent";
import {ConditionUpdaterService} from "../../services/condition-updater.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends AbstractObserverComponent implements OnInit, OnDestroy {
  showleaderboard = false;
  showMap =false;
  username;
  matches: Array<Match> = [];
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
    this.init();
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.dataService.sendMessage();
    this.updateMatches();
    this.matchesSub = this.dataService.getMatches().subscribe(matches=>this.matches = matches);
  }

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
      },
      error => alert(error)
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
    return (match.state === MatchState.STARTED) &&
      match.users.includes(this.username)
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
