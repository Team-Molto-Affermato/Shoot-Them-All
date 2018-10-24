var Match = /** @class */ (function () {
    function Match(id, matchBaseInfo, players, matchState) {
        this.id = id;
        this.matchBaseInfo = matchBaseInfo;
        this.players = players;
        this.matchState = matchState;
    }
    return Match;
}());
export { Match };
var MatchBaseInfo = /** @class */ (function () {
    function MatchBaseInfo(access, centerPoint, radius, startingTime, duration, maxPlayerNumber, password) {
        this.access = access;
        this.centerPoint = centerPoint;
        this.radius = radius;
        this.startingTime = startingTime;
        this.duration = duration;
        this.maxPlayerNumber = maxPlayerNumber;
        this.password = password;
    }
    return MatchBaseInfo;
}());
export { MatchBaseInfo };
export var MatchAccess;
(function (MatchAccess) {
    MatchAccess[MatchAccess["PUBLIC"] = 0] = "PUBLIC";
    MatchAccess[MatchAccess["PRIVATE"] = 1] = "PRIVATE";
})(MatchAccess || (MatchAccess = {}));
export var MatchState;
(function (MatchState) {
    MatchState[MatchState["SETTING_UP"] = 0] = "SETTING_UP";
    MatchState[MatchState["STARTED"] = 1] = "STARTED";
    MatchState[MatchState["ENDED"] = 2] = "ENDED";
})(MatchState || (MatchState = {}));
//# sourceMappingURL=match.js.map
