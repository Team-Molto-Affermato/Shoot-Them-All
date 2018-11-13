import { Component, OnInit } from '@angular/core';
import {MatchComponent} from "../../match.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-earth-map',
  templateUrl: './earth-map.component.html',
  styleUrls: ['./earth-map.component.css']
})
export class EarthMapComponent implements OnInit {

  centralPosition;
  userPositions;
  styles;

  constructor(private matchComponent: MatchComponent,
              private http: HttpClient) {
    this.http.get("../../../../assets/earthMapStyles.json").subscribe(
      data => {
        this.styles = data;
      }, error => {
        console.log(error)
      }
    )
    this.centralPosition = this.matchComponent.userInMatch.position;
    this.userPositions = this.matchComponent.players;
  }

  ngOnInit() {
  }

}
