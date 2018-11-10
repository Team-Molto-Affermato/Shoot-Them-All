import { Component, OnInit } from '@angular/core';
import {MatchComponent} from "../../match.component";

@Component({
  selector: 'app-earth-map',
  templateUrl: './earth-map.component.html',
  styleUrls: ['./earth-map.component.css']
})
export class EarthMapComponent implements OnInit {

  constructor(private matchComponent: MatchComponent) { }

  ngOnInit() {
  }

}
