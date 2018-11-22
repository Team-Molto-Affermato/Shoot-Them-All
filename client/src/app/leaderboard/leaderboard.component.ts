import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {UserInLeaderboard, UserScore} from "../../models/user";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Match} from "../../models/match";
import {Team} from "../../models/team";

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = ['position', 'username', 'score'];
  leaderBoardSub: Subscription;
  leaderboard: Array<UserInLeaderboard> = [];
  dataSource = new MatTableDataSource<UserInLeaderboard>(this.leaderboard);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dataService:DataService,private http:HttpClient) { }

  ngOnInit(){
    this.leaderBoardSub = this.dataService.getLeaderboard().subscribe(
      scores=>{
        this.leaderboard = scores.map(
          (v,index)=>new UserInLeaderboard(
            index+1,v.username,v.score)
        );
        this.refresh();
      }
    );
    this.http.get('api/users/score').subscribe(
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
