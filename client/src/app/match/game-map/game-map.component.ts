import {AfterViewInit, Component, OnInit} from '@angular/core';
import Swiper from 'swiper';

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
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      loop: true,
      // spaceBetween: '20%',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

}
