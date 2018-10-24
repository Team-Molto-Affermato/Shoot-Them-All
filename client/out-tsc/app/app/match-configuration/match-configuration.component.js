var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Match, MatchAccess, MatchBaseInfo, MatchState } from "../../models/match";
import { Point } from "../../models/point";
import { MatchConfigurationService } from "../../services/match-configuration.service";
import { MatchInfoService } from "../../services/match-info.service";
var MatchConfigurationComponent = /** @class */ (function () {
    function MatchConfigurationComponent(router, formBuilder, matchConfigurationService, matchInfoService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.matchConfigurationService = matchConfigurationService;
        this.matchInfoService = matchInfoService;
        this.access = MatchAccess.PUBLIC;
        this.passwordVisible = false;
        this.newMatchForm = this.createFormGroup();
    }
    MatchConfigurationComponent.prototype.ngOnInit = function () {
    };
    MatchConfigurationComponent.prototype.createFormGroup = function () {
        return this.formBuilder.group({
            access: this.access,
            password: '',
            duration: '',
            areaRadius: '',
            maxPlayerNumber: ''
        });
    };
    MatchConfigurationComponent.prototype.switchAccess = function () {
        if (this.access == MatchAccess.PUBLIC) {
            this.access = MatchAccess.PRIVATE;
            this.passwordVisible = true;
        }
        else {
            this.access = MatchAccess.PUBLIC;
            this.passwordVisible = false;
        }
    };
    MatchConfigurationComponent.prototype.createNewMatch = function () {
        var _this = this;
        var formValues = this.newMatchForm.value;
        var matchBaseInfo = new MatchBaseInfo(this.access, new Point(0, 0), formValues.areaRadius, 0, formValues.duration, formValues.maxPlayerNumber, formValues.password);
        var match = new Match("0", matchBaseInfo, [], MatchState.WAITING);
        this.matchConfigurationService.createNewMatch(match).subscribe(function (data) {
            alert(data);
            _this.matchInfoService.setCurrentMatchId(data.id);
        }, function (error) { return alert(error); });
        this.router.navigate(["/matchInfo"]);
    };
    MatchConfigurationComponent = __decorate([
        Component({
            selector: 'app-match-configuration',
            templateUrl: './match-configuration.component.html',
            styleUrls: ['./match-configuration.component.css']
        }),
        __metadata("design:paramtypes", [Router,
            FormBuilder,
            MatchConfigurationService,
            MatchInfoService])
    ], MatchConfigurationComponent);
    return MatchConfigurationComponent;
}());
export { MatchConfigurationComponent };
//# sourceMappingURL=match-configuration.component.js.map