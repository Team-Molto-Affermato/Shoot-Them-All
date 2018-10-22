import { Component, OnInit } from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  matches: Array<Match> = [];

  constructor(private homeService: HomeService,
              private matchInfoService: MatchInfoService) {
    this.updateMatches();
  }

  ngOnInit() {
  }

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
      },
      error => alert(error)
    );
  }

}
