import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import { DataService } from '../../services/data.service';
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  matches: Array<Match> = [];

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private homeService: HomeService,
              private dataService: DataService,
              private matchInfoService: MatchInfoService) {
    this.updateMatches();
  }

  ngOnInit() {
    this.dataService.sendMessage();
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
    // this.matchInfoService.setCurrentMatch(match);
    LocalStorageHelper.setItem(StorageKey.MACTH, match);
    this.router.navigateByUrl("/matchInfo");
  }

}
