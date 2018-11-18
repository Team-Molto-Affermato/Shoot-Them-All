import {ComponentName} from "../app/app.module";
import {CollectionsHelper} from "../utilities/CollectionsHelper";
export class RoleHelper {
  static roleConditions: Map<Role, Set<Condition>>;
  
  static initialize() {

    this.roleConditions = new Map([
      [Role.VISITOR, new Set()],
      [Role.MANAGER, new Set([Condition.POSITION])],
      [Role.PLAYER, new Set([Condition.POSITION, Condition.ORIENTATION])]
    ]);

  }

  static checkConditions(role: Role, conditions: Set<Condition>) {

    return CollectionsHelper.setsEqual(this.roleConditions.get(role), conditions);

  }

}

export enum Role {
  VISITOR = 1,
  MANAGER = 2,
  PLAYER = 3
}

export enum Condition {
  POSITION,
  ORIENTATION
}
