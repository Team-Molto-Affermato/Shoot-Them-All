import { Component, OnInit } from '@angular/core';
import {drawParticles} from "../../assets/scripts/particles";

@Component({
  selector: 'app-particle-canvas',
  templateUrl: './particle-canvas.component.html',
  styleUrls: ['./particle-canvas.component.scss']
})
export class ParticleCanvasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);
  }

}
