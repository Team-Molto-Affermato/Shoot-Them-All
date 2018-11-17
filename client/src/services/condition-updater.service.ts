import {Injectable} from '@angular/core';
import {LocalStorageHelper, StorageKey} from "../utilities/LocalStorageHelper";
import {Router} from "@angular/router";
import {Condition, Role, RoleHelper} from "../models/RoleHelper";
import {Point} from "../models/point";
import {none, Option, some} from "ts-option";
import {ObserverComponent} from "../app/ObserverComponent";

@Injectable({
  providedIn: 'root'
})
export class ConditionUpdaterService {

  conditions: Set<Condition> = new Set();
  orientation: Option<Condition> = none;

  ready: boolean = false;

  position: Point;

  observerComponent: Option<ObserverComponent> = none;

  constructor() {
  }

  init() {
    const self = this;
    window.addEventListener("deviceorientationabsolute", (event: DeviceOrientationEvent) => function handleOrientation(event) {

      if (event.alpha) {
        self.orientation = some(Condition.ORIENTATION);
      }

      window.removeEventListener("deviceorientationabsolute", this)
    });
    setInterval(() => this.updateConditions(), 2000);
    this.updateConditions();
  }

  checkConditions(role: Role): boolean {
    return RoleHelper.checkConditions(role, this.conditions);
  }

  updateConditions() {
    var conditions: Set<Condition> =  new Set();
    if (this.orientation.isDefined) {
      conditions.add(this.orientation.get);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
          if (pos.coords.latitude && pos.coords.longitude) {
            this.position = new Point(pos.coords.latitude, pos.coords.longitude);
            conditions.add(Condition.POSITION);
          }
        },
        error => console.log(error));
    }

    setTimeout(() => {
      if(!this.ready) {
        this.ready = true;
      }
      this.conditions = conditions;
      this.observerComponent.map(_ => _.notifyUpdate());
    }, 2000);
  }

  setObserver(observerComponent: ObserverComponent) {
    this.observerComponent = some(observerComponent);
  }

  removeObserver() {
    this.observerComponent = none;
  }



  // handleOrientation(event: DeviceOrientationEvent) {
  //
  //   var orientation: boolean = false;
  //
  //   if (event.alpha) {
  //     orientation = true
  //   }
  //   setInterval(() => this.updateConditions(orientation), 2000);
  //
  // }
  //
  // updateConditions(orientation: boolean) {
  //
  //   var position: boolean = false;
  //
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((pos) => {
  //       if (pos.coords.latitude && pos.coords.longitude) {
  //         position = true;
  //       }
  //     },
  //     error => console.log(error));
  //   }
  //
  //   setTimeout(() => this.checkRole(position, orientation), 2000);
  // }
  //
  //
  // checkRole(position, orientation) {
  //
  //   var role: Role;
  //
  //   if (position && orientation) {
  //     role = Role.PLAYER;
  //   } else if (position) {
  //     role = Role.MANAGER;
  //   } else {
  //     role = Role.VISITOR;
  //   }
  //
  //   // alert(role);
  //
  //
  //   const url = this.router.url;
  //   const permissions = RoleHelper.checkPermissions(role, url);
  //
  //   if(url === "/"+ComponentName.ERROR) {
  //     if(permissions) {
  //       if(LocalStorageHelper.hasItem(StorageKey.PREVIOUS_COMPONENT)) {
  //         this.router.navigateByUrl(LocalStorageHelper.getItem(StorageKey.PREVIOUS_COMPONENT));
  //       }
  //     }
  //   } else {
  //     if(!permissions) {
  //       LocalStorageHelper.setItem(StorageKey.ROLE, role);
  //       this.router.navigateByUrl("/error");
  //     }
  //   }
  //
  // }


}
