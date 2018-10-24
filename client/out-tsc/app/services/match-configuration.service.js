var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ErrorsHandlerService } from "./errors-handler.service";
import { catchError } from "rxjs/operators";
var MatchConfigurationService = /** @class */ (function () {
    function MatchConfigurationService(http, errorsHandlerService) {
        this.http = http;
        this.errorsHandlerService = errorsHandlerService;
    }
    MatchConfigurationService.prototype.createNewMatch = function (match) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'my-auth-token'
            })
        };
        return this.http.post("/matches", match, httpOptions)
            .pipe(catchError(this.errorsHandlerService.handleError));
    };
    MatchConfigurationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient,
            ErrorsHandlerService])
    ], MatchConfigurationService);
    return MatchConfigurationService;
}());
export { MatchConfigurationService };
//# sourceMappingURL=match-configuration.service.js.map