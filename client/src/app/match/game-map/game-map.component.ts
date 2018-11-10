import {Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.css']
})
export class GameMapComponent implements OnInit {

  showRadar = true;

  constructor() { }

  ngOnInit() {

  }

  switchComponent() {
    this.showRadar = !this.showRadar;
  }

}
