import {ComponentName} from "../app/app.module";

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
    console.log(this.roleConditions.get(role));
    console.log(conditions);

    var result = true;

    this.roleConditions.get(role).forEach(c => {
      if (!conditions.has(c)) {
        result = false;
      }
    });

    return result;
  }

}

export enum Role {
  VISITOR = 1,
  MANAGER = 2,
  PLAYER = 3
}

export enum Condition {
  POSITION = "position",
  ORIENTATION = "orientation"
}
