import {Match} from "../models/match";

export class LocalStorageHelper {

  constructor() { }

  static setItem(key: StorageKey, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem(key: StorageKey) {
    return JSON.parse(localStorage.getItem(key));
  }

  static removeItem(key: StorageKey) {
    localStorage.removeItem(key);
  }

  static getCurrentMatch(): Match {
    var match = LocalStorageHelper.getItem(StorageKey.MACTH);
    match.startingTime = new Date(match.startingTime);
    return match;
  }

  static hasItem(key: StorageKey): boolean {
    return localStorage.getItem(key) !== null
  }
}

export enum StorageKey {
  CLICKED_USER = "clicked_user",
  USERNAME = "username",
  MACTH =  "match",
  ROLE =  "role",
  PREVIOUS_COMPONENT = "previous_component",
  COMPLETE_FUNCTIONALITIES = "functionalities",
  POINTED_COMPONENT = "pointed_component",
  MATCH_PASSWORD = "match_password"
}
