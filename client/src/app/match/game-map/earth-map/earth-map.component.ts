import { Component, OnInit } from '@angular/core';
import {MatchComponent} from "../../match.component";
import { AgmCoreModule } from '@agm/core';
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
    this.centralPosition = this.matchComponent.position;
    this.userPositions = this.matchComponent.players.map(p => p.userPosition);
  }

  ngOnInit() {
  }

}
