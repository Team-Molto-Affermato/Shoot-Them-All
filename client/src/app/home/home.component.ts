import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match, MatchState} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {DataService} from '../../services/data.service';
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showleaderboard = false;
  username;
  matches: Array<Match> = [];
  matchesSub: Subscription;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private homeService: HomeService,
              private dataService: DataService) {
    this.updateMatches();
  }
  switchComponent() {
    this.showleaderboard = !this.showleaderboard;
  }
  ngOnInit() {
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.dataService.sendMessage();
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

}
