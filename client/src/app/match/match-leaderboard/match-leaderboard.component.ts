import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {DataService} from "../../../services/data.service";
import {rankings, UserInLeaderboard, UserScore} from "../../../models/user";
import {HttpClient} from "@angular/common/http";
import {LocalStorageHelper} from "../../../utilities/LocalStorageHelper";
import {Match, MatchOrganization} from "../../../models/match";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {Chart} from 'chart.js';
import {Team} from "../../../models/team";

@Component({
  selector: 'app-match-leaderboard',
  templateUrl: './match-leaderboard.component.html',
  styleUrls: ['./match-leaderboard.component.css']
})
export class MatchLeaderboardComponent implements OnInit, AfterViewInit {

  @ViewChild('doughnutChart') private chartRef;
  chart: any;
  topScore:number = 35000;
  displayedColumns: string[] = ['position', 'username', 'score',"ranking"];
  match:Match;
  userScoreSub: Subscription;
  scoreTeam1:number = 0;
  scoreTeam2:number = 0;
  teamVisible:boolean =false;
  leaderboard: Array<UserInLeaderboard> = [];
  leaderboardTeam1: Array<UserInLeaderboard> = [];
  leaderboardTeam2: Array<UserInLeaderboard> = [];

  dataSource = new MatTableDataSource<UserInLeaderboard>(this.leaderboard);
  dataSourceTeam1 = new MatTableDataSource<UserInLeaderboard>(this.leaderboardTeam1);
  dataSourceTeam2 = new MatTableDataSource<UserInLeaderboard>(this.leaderboardTeam2);
  data = {
    datasets: [{
      data: [1, 1],
      backgroundColor: ['#2980b9',
      '#e74c3c'],
      borderColor: ['#2980b9',
        '#e74c3c']
    }],
    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'Team 1',
      'Team 2'
    ]
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dataService: DataService,private http:HttpClient) { }

  ngOnInit() {
    this.match = LocalStorageHelper.getCurrentMatch();
    this.teamVisible = this.match.organization === MatchOrganization.TEAM;
    this.dataSource.paginator = this.paginator;

    console.log("Dati da passare al chart: ",this.data);
    console.log("Chart: ",this.chart);
    this.userScoreSub = this.dataService.getScores().subscribe(
      scores=>{
        this.leaderboard = scores.map(
          (v,index)=>new UserInLeaderboard(
            index+1,v.username,v.score,this.getRankings(v.scoreG))
        );
        if(this.match.organization === MatchOrganization.TEAM) {
          this.leaderboardTeam1 =
            scores
            .filter(s=>s.team===Team.TEAM1)
            .map((v,index)=>new UserInLeaderboard(
                index+1,v.username,v.score,this.getRankings(v.scoreG))
            );
          this.leaderboardTeam2 =
            scores
              .filter(s=>s.team===Team.TEAM2)
              .map((v,index)=>new UserInLeaderboard(
                index+1,v.username,v.score,this.getRankings(v.scoreG))
              );
        }
          this.refresh();
      }
  );
  }
  ngAfterViewInit(){
    this.http.get<Array<UserScore>>('api/matches/'+this.match.name+'/users/score').subscribe(
      (dataR:Array<UserScore>)=>{
        console.log("From get: ",dataR);
        console.log("nome match: ",this.match.name);
        console.log("Dati get: ",dataR);
        this.leaderboard = dataR.map(
          (v,index)=>new UserInLeaderboard(
            index+1,v.username,v.score,this.getRankings(v.scoreG)
          )
        );
        if(this.match.organization === MatchOrganization.TEAM) {
          this.leaderboardTeam1 =
            dataR
              .filter(s=>s.team===Team.TEAM1)
              .map((v,index)=>new UserInLeaderboard(
                index+1,v.username,v.score,this.getRankings(v.scoreG))
              );
          this.leaderboardTeam2 =
            dataR
              .filter(s=>s.team===Team.TEAM2)
              .map((v,index)=>new UserInLeaderboard(
                index+1,v.username,v.score,this.getRankings(v.scoreG))
              );
        }
        this.refresh();
      },err =>{
        console.log(err);
      });

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data: this.data,
      option: Chart.defaults.doughnut
    });

  }
  refresh() {
    this.dataSource.data = this.leaderboard;
    if(this.match.organization === MatchOrganization.TEAM) {
      this.scoreTeam1 =
        this.leaderboardTeam1
        .map(v=>v.score)
        .reduce((sum,current)=> sum +current,0);

      this.scoreTeam2 =
        this.leaderboardTeam2
          .map(v=>v.score)
          .reduce((sum,current)=> sum +current,0);
      console.log(this.scoreTeam2,this.scoreTeam1);
      this.dataSourceTeam1.data = this.leaderboardTeam1;
      this.dataSourceTeam2.data = this.leaderboardTeam2;
      // this.chart.data.datasets.forEach((dataset) => {
      //   dataset.data.pop();
      // });
      console.log(this.chart.data);
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data = [this.scoreTeam1,this.scoreTeam2]
      });
      this.chart.update();
    }
  };
  getRankings(score:number):string {
    var level =  Math.floor(score/(this.topScore/14));
    level = level>14?14:level<0?0:level;
    return rankings[level];
  }
}
