import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Swiper from 'swiper';
import {falseIfMissing} from "protractor/built/util";

@Component({
  selector: 'app-game-map',
  templateUrl: './game-map.component.html',
  styleUrls: ['./game-map.component.css']
})
export class GameMapComponent implements OnInit, AfterViewInit {

  swiper: Swiper;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.swiper = new Swiper('.swiper-container', {
    //   slidesPerView: 1,
    //   loop: false,
    //   // spaceBetween: '20%',
    //   pagination: {
    //     el: '.swiper-pagination',
    //     clickable: true,
    //   },
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   }
    // });

    // console.log("alloraaa");
    // console.log(this.map.mapId._element);
      // .children.item(0))
      // .getElementsByTagName('agm-map').item(0).style.height = '20vh'
  }

}
