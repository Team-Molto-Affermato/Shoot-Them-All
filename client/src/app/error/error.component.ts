import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractObserverComponent} from "../ObserverComponent";
import {ActivatedRoute, Router} from "@angular/router";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent extends AbstractObserverComponent implements OnInit, OnDestroy {

  constructor(router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }

  ngOnInit() {
    this.init();
  }

  update(standardRoleConditions: boolean, restrictedRoleConditions) {
    if (LocalStorageHelper.hasItem(StorageKey.POINTED_COMPONENT) && (standardRoleConditions || restrictedRoleConditions)) {
      this.router.navigateByUrl(LocalStorageHelper.getItem(StorageKey.POINTED_COMPONENT));
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
