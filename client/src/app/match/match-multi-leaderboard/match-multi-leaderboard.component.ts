import { Component, OnInit } from '@angular/core';
import {LocalStorageHelper} from "../../../utilities/LocalStorageHelper";
import {UserScore} from "../../../models/user";
import {Match} from "../../../models/match";
import {Subscription} from "rxjs";
import {DataService} from "../../../services/data.service";
import {HttpClient} from "@angular/common/http";
import {Team} from "../../../models/team";

@Component({
  selector: 'app-match-multi-leaderboard',
  templateUrl: './match-multi-leaderboard.component.html',
  styleUrls: ['./match-multi-leaderboard.component.css']
})
export class MatchMultiLeaderboardComponent implements OnInit {
  match:Match;
  userScoreSub: Subscription;
  scoreTeam1 : number = 0;
  scoreTeam2 : number = 0;
  leaderboardTeam1: Array<UserScore> = [];
  leaderboardTeam2: Array<UserScore> = [];

  constructor(private dataService: DataService,private http:HttpClient) { }

  ngOnInit() {
    this.match = LocalStorageHelper.getCurrentMatch();
    this.userScoreSub = this.dataService.getScores().subscribe(
      scores=>{
        console.log(scores);
        this.leaderboardTeam1 = scores.filter(s=>s.team === Team.TEAM1 );
        this.leaderboardTeam1.forEach(score=>{this.scoreTeam1+=score.score});
        this.leaderboardTeam2 = scores.filter(s=>s.team === Team.TEAM2 );
        this.leaderboardTeam2.forEach(score=>this.scoreTeam2+=score.score);
      }
    );
    this.http.get('api/matches/'+this.match.name+'/users/score').subscribe(
      (data: Array<UserScore>)=>{
        this.leaderboardTeam1 = data.filter(s=>s.team === Team.TEAM1 );
        this.leaderboardTeam1.forEach(score=>{this.scoreTeam1+=score.score});
        this.leaderboardTeam2 = data.filter(s=>s.team === Team.TEAM2 );
        this.leaderboardTeam2.forEach(score=>this.scoreTeam2+=score.score);
      },err =>{
        console.log(err);
      });
  }

}
