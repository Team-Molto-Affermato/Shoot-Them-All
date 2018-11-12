import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {UserScore} from "../../models/user";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderBoardSub: Subscription;
  leaderboard: Array<UserScore> = [];
  constructor(private dataService:DataService,private http:HttpClient) { }

  ngOnInit(){
    this.leaderBoardSub = this.dataService.getLeaderboard().subscribe(
      scores=>{
        this.leaderboard = scores;
      }
    );
    this.http.get('api/users/score').subscribe(
      (data: Array<UserScore>)=>{
        this.leaderboard = data;
      },err =>{
        console.log(err);
      });
  }

}
