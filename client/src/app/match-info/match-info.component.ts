import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatchInfoService} from "../../services/match-info.service";
import {Match} from "../../models/match";

@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent implements OnInit {

  match: Match;

  constructor(private router: Router,
              private matchInfoService: MatchInfoService) {
    this.match = matchInfoService.getCurrentMatch();
  }

  ngOnInit() {
  }

  
}
