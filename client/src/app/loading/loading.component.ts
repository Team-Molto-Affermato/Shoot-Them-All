import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {AbstractObserverComponent} from "../ObserverComponent";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent extends AbstractObserverComponent implements OnInit, OnDestroy {

  percentage: number = 0;
  progressStep:number = 25;

  intervalId;

  constructor(router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }

  ngOnInit() {
    this.init();

    this.intervalId = setInterval(() => this.updatePercentage(), 450);
  }

  update(standardRoleConditions: boolean, restrictedRoleConditions) {
    if (LocalStorageHelper.hasItem(StorageKey.POINTED_COMPONENT)) {
      this.router.navigateByUrl(LocalStorageHelper.getItem(StorageKey.POINTED_COMPONENT));
    }
  }

  updatePercentage() {
    this.percentage = this.percentage<(100-this.progressStep) ? this.percentage+this.progressStep : 100;

    document.getElementById('progress-bar').style.width = '' +  this.percentage + '%';

    if(this.percentage == 100) {
      clearInterval(this.intervalId);
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
