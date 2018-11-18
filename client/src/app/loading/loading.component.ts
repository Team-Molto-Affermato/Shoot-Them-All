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

  constructor(router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }

  ngOnInit() {
    this.init();
  }

  update(standardRoleConditions: boolean, restrictedRoleConditions) {
    if (LocalStorageHelper.hasItem(StorageKey.POINTED_COMPONENT)) {
      this.router.navigateByUrl(LocalStorageHelper.getItem(StorageKey.POINTED_COMPONENT));
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
