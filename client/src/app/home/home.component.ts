import { Component, OnInit } from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";

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
              private matchInfoService: MatchInfoService) {
    alert("ciao");
    this.updateMatches();
  }

  ngOnInit() {
    alert("On Init");
  }

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
      },
      error => alert(error)
    );
  }

  logout() {
    this.authenticationService.logout();
  }

}
