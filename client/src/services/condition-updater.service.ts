import {Injectable} from '@angular/core';
import {LocalStorageHelper, StorageKey} from "../utilities/LocalStorageHelper";
import {Router} from "@angular/router";
import {Condition, Role, RoleHelper} from "../models/RoleHelper";
import {Point} from "../models/point";
import {none, Option, some} from "ts-option";
import {ObserverComponent} from "../app/ObserverComponent";
import {EventListener} from "ngx-bootstrap/utils/facade/browser";

@Injectable({
  providedIn: 'root'
})
export class ConditionUpdaterService {

  conditions: Set<Condition> = new Set();
  orientation: Option<Condition> = none;

  ready: boolean = false;

  position: Point;

  observerComponent: Option<ObserverComponent> = none;

  listener: EventListener = (event) => this.handleOrientation(event);

  constructor() {
  }



  init() {

    window.addEventListener("deviceorientationabsolute", this.listener);

    setInterval(() => this.updateConditions(), 2000);
    this.updateConditions();
  }

  private handleOrientation(event) {
    if (event.alpha) {
      this.orientation = some(Condition.ORIENTATION);
      window.removeEventListener("deviceorientationabsolute", this.listener)
    }
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
    }, 2500);
  }

  setObserver(observerComponent: ObserverComponent) {
    this.observerComponent = some(observerComponent);
  }

  removeObserver() {
    this.observerComponent = none;
  }

}
