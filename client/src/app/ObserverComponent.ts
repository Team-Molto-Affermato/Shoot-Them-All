import {OnDestroy, OnInit} from "@angular/core";
import {ConditionUpdaterService} from "../services/condition-updater.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageHelper, StorageKey} from "../utilities/LocalStorageHelper";
import {Role} from "../models/RoleHelper";
import {ComponentName} from "./app.module";

export interface ObserverComponent {
  notifyUpdate();
  update(standardRoleConditions: boolean, restrictedRoleConditions: boolean)
}

export abstract class AbstractObserverComponent implements ObserverComponent {

  completeFunctionalities: boolean;

  protected constructor(protected router: Router,
                        protected conditionUpdaterService: ConditionUpdaterService,
                        private route: ActivatedRoute) {

  }

  init(): void {
    if (LocalStorageHelper.hasItem(StorageKey.COMPLETE_FUNCTIONALITIES)) {
      this.completeFunctionalities = LocalStorageHelper.getItem(StorageKey.COMPLETE_FUNCTIONALITIES);
    }
    this.conditionUpdaterService.setObserver(this)
  }

  notifyUpdate() {
    const standardRole: Role = this.route.snapshot.data["standardRole"];
    const restrictedRole: Role = this.route.snapshot.data["restrictedRole"];

    const standardRoleConditions = standardRole && this.conditionUpdaterService.checkConditions(standardRole);
    const restrictedRoleConditions = restrictedRole && this.conditionUpdaterService.checkConditions(restrictedRole);

    // this.update(standardRoleConditions, restrictedRoleConditions);
  }

  update(standardRoleConditions: boolean, restrictedRoleConditions: boolean) {
    if (standardRoleConditions) {
      this.completeFunctionalities = true;
      LocalStorageHelper.setItem(StorageKey.COMPLETE_FUNCTIONALITIES, true);
    } else if (restrictedRoleConditions) {
      this.completeFunctionalities = false;
      LocalStorageHelper.setItem(StorageKey.COMPLETE_FUNCTIONALITIES, false);
    } else {
      LocalStorageHelper.setItem(StorageKey.POINTED_COMPONENT, this.router.url);
      this.router.navigateByUrl("/error");
    }
  }

  destroy(): void {
    this.conditionUpdaterService.removeObserver();
  }



}
