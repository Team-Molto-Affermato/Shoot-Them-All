import { Component, OnInit } from '@angular/core';
import {drawParticles} from "../../assets/scripts/particles";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);
  }

}
