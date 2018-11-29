import {Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {HomeService} from "../../services/home.service";
import {Match, MatchState} from "../../models/match";
import {MatchInfoService} from "../../services/match-info.service";
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from '../../services/data.service';
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {AbstractObserverComponent} from "../ObserverComponent";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Subscription} from "rxjs";
import {drawParticles} from "../../assets/scripts/particles";
import Swiper from 'swiper';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends AbstractObserverComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['name', 'state', 'access'];
  matches: Array<Match> = [];
  dataSource = new MatTableDataSource<Match>(this.matches);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  showMap =false;
  username;
  matchesSub: Subscription;
  swiper: Swiper;

  constructor(private authenticationService: AuthenticationService,
              private homeService: HomeService,
              private dataService: DataService,
              router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }

  switchComponent() {
    this.showMap = !this.showMap;
  }

  ngOnInit() {

    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);

    this.matchesSub = this.dataService
      .getMatches()
      .subscribe(matches=>{
        this.matches = matches;
        console.log(this.matches);
        this.refresh();
      });
    this.init();
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.dataService.sendMessage();
    this.updateMatches();
    this.dataSource.paginator = this.paginator;
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

  updateMatches() {
    this.homeService.getMatches().subscribe(
      (data: Array<Match>) => {
        this.matches = data;
        this.refresh();
      },
      // error => alert(error)
    );
  }
   refresh() {
    this.dataSource.data = this.matches;
  };

  showInfo(match: Match) {
    LocalStorageHelper.setItem(StorageKey.MACTH, match);

    if (this.userJoined(match)) {
      this.router.navigateByUrl("/match");
    } else {
      this.router.navigateByUrl("/matchInfo");
    }
  }

  userJoined(match: Match): boolean {
    return (match.state === MatchState.STARTED) &&
      match.users.includes(this.username)
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
