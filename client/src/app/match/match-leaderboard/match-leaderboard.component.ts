import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../../../services/data.service";
import {UserScore} from "../../../models/user";
import {HttpClient} from "@angular/common/http";
import {LocalStorageHelper} from "../../../utilities/LocalStorageHelper";
import {Match} from "../../../models/match";

@Component({
  selector: 'app-match-leaderboard',
  templateUrl: './match-leaderboard.component.html',
  styleUrls: ['./match-leaderboard.component.css']
})
export class MatchLeaderboardComponent implements OnInit {
  match:Match;
  userScoreSub: Subscription;
  leaderboard: Array<UserScore> = [];
  constructor(private dataService: DataService,private http:HttpClient) { }

  ngOnInit() {
    this.match = LocalStorageHelper.getCurrentMatch();
    this.userScoreSub = this.dataService.getScores().subscribe(
      scores=>{
          console.log(scores);
          this.leaderboard = scores;
      }
    );
    this.http.get('api/matches/'+this.match.name+'/users/score').subscribe(
      (data: Array<UserScore>)=>{
      this.leaderboard = data;
    },err =>{
      console.log(err);
    });
  }

}
