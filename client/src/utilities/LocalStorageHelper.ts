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
}

export enum StorageKey {
  USERNAME = "username",
  MACTH =  "match"
}
