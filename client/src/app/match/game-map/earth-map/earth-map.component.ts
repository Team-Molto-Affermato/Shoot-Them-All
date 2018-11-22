import { Component, OnInit } from '@angular/core';
import {MatchComponent} from "../../match.component";
import {HttpClient} from "@angular/common/http";
import {Match} from "../../../../models/match";

@Component({
  selector: 'app-earth-map',
  templateUrl: './earth-map.component.html',
  styleUrls: ['./earth-map.component.css']
})
export class EarthMapComponent implements OnInit {
  match: Match;
  userPositions;
  styles;

  constructor(private matchComponent: MatchComponent,
              private http: HttpClient) {

  }

  ngOnInit() {
    this.http.get("../../../../assets/styles/earthMapStyles.json").subscribe(
      data => {
        this.styles = data;
      }, error => {
        console.log(error)
      }
    )
    this.match = this.matchComponent.match;

    console.log(this.matchComponent.match);
    console.log(this.matchComponent.match.centralPoint);

    this.userPositions = this.matchComponent.players;
  }
}
