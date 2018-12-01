import {Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match, MatchState} from "../../models/match";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from '../../services/data.service';
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {AbstractObserverComponent} from "../ObserverComponent";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {drawParticles} from "../../assets/scripts/particles";
import Swiper from 'swiper';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends AbstractObserverComponent implements OnInit, OnDestroy, AfterViewInit {
  username;
  swiper: Swiper;

  constructor(private authenticationService: AuthenticationService,
              router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }


  ngOnInit() {

    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);


    this.init();
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
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


  // userJoined(match: Match): boolean {
  //   return (match.state === MatchState.STARTED) &&
  //     match.users.includes(this.username)
  // }

  ngOnDestroy(): void {
    this.destroy();
  }

}
