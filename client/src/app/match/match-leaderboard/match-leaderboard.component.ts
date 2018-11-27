import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../../../services/data.service";
import {UserInLeaderboard, UserScore} from "../../../models/user";
import {HttpClient} from "@angular/common/http";
import {LocalStorageHelper} from "../../../utilities/LocalStorageHelper";
import {Match} from "../../../models/match";
import {MatPaginator, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-match-leaderboard',
  templateUrl: './match-leaderboard.component.html',
  styleUrls: ['./match-leaderboard.component.css']
})
export class MatchLeaderboardComponent implements OnInit {
  displayedColumns: string[] = ['position', 'username', 'score'];
  match:Match;
  userScoreSub: Subscription;
  leaderboard: Array<UserInLeaderboard> = [];
  dataSource = new MatTableDataSource<UserInLeaderboard>(this.leaderboard);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataService: DataService,private http:HttpClient) { }

  ngOnInit() {
    this.match = LocalStorageHelper.getCurrentMatch();
    this.userScoreSub = this.dataService.getScores().subscribe(
      scores=>{
        this.leaderboard = scores.map(
          (v,index)=>new UserInLeaderboard(
            index+1,v.username,v.score)
        );
        this.refresh();
      }
  );
    this.http.get('api/matches/'+this.match.name+'/users/score').subscribe(
      (data: Array<UserScore>)=>{
        this.leaderboard = data.map(
          (v,index)=>new UserInLeaderboard(
            index+1,v.username,v.score)
        );
        this.refresh();
    },err =>{
      console.log(err);
    });
    this.dataSource.paginator = this.paginator;

  }
  refresh() {
    this.dataSource.data = this.leaderboard;
  };
}
