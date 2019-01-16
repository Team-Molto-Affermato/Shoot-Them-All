import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Match, MatchAccess, MatchState} from "../../models/match";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {HomeService} from "../../services/home.service";
import {DataService} from "../../services/data.service";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-match-map',
  templateUrl: './match-map.component.html',
  styleUrls: ['./match-map.component.css']
})
export class MatchMapComponent implements OnInit, OnDestroy {

  @ViewChild('matchMap') mapId: ElementRef;

  username;
  matches: Array<Match> = [];
  matchesSub: Subscription;
  styles;

  constructor(private http:HttpClient,
              private router: Router,
              private authenticationService: AuthenticationService,
              private homeService: HomeService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.http.get("../../assets/styles/earthMapStyles.json").subscribe(
      data => {
        this.styles = data;
      }, error => {
        console.log(error)
      }
    )
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.dataService.sendMessage();
    this.matchesSub = this.dataService.getMatches().subscribe(matches=>this.matches = matches);
    this.updateMatches();
  }

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
      },
      // error => alert(error)
    );
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

  showInfo(match: Match) {
    LocalStorageHelper.setItem(StorageKey.MACTH, match);
    this.router.navigateByUrl("/matchInfo");
  }

  ngOnDestroy() {
    this.matchesSub.unsubscribe();
  }
}
