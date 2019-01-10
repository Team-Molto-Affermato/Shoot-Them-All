import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {ConditionUpdaterService} from "./condition-updater.service";
import {Role} from "../models/RoleHelper";
import {LocalStorageHelper, StorageKey} from "../utilities/LocalStorageHelper";

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private router: Router,
              private conditionUpdaterService: ConditionUpdaterService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    return true;

    if(this.conditionUpdaterService.ready) {
      const standardRole: Role = route.data["standardRole"];
      const restrictedRole: Role = route.data["restrictedRole"];

      if (standardRole && this.conditionUpdaterService.checkConditions(standardRole)) {
        LocalStorageHelper.setItem(StorageKey.COMPLETE_FUNCTIONALITIES, true);
      } else if (restrictedRole && this.conditionUpdaterService.checkConditions(restrictedRole)) {
        LocalStorageHelper.setItem(StorageKey.COMPLETE_FUNCTIONALITIES, false);
      } else {
        LocalStorageHelper.setItem(StorageKey.POINTED_COMPONENT, route.url.toString());
        this.router.navigateByUrl("/error");
        return false;
      }
    } else {
      LocalStorageHelper.setItem(StorageKey.POINTED_COMPONENT, route.url.toString());
      this.router.navigateByUrl("/loading");
      return false;
    }
    return true;
  }
}
