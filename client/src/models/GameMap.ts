import {MatchComponent} from "../app/match/match.component";
import {some} from "ts-option";

export interface GameMap {
  updatePosition(userInArea);
}

export abstract class AbstractGameMap implements GameMap {

  protected constructor(matchComponent: MatchComponent) {
    matchComponent.gameMap = some(this);
  }

  abstract updatePosition(userInArea);

}
