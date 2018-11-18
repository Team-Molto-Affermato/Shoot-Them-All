import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {Match, MatchAccess, MatchOrganization, MatchState} from "../../models/match";
import {MatchConfigurationService} from "../../services/match-configuration.service";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {Point} from "../../models/point";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {AbstractObserverComponent} from "../ObserverComponent";

@Component({
  selector: 'app-match-configuration',
  templateUrl: './match-configuration.component.html',
  styleUrls: ['./match-configuration.component.css']
})
export class MatchConfigurationComponent extends AbstractObserverComponent implements OnInit, OnDestroy {

  newMatchForm: FormGroup;

  access: MatchAccess = MatchAccess.PUBLIC;
  passwordVisible = false;
  organization: MatchOrganization = MatchOrganization.SINGLE_PLAYER;

  constructor(private formBuilder: FormBuilder,
              private matchConfigurationService: MatchConfigurationService,
              router: Router,
              conditionObserverService: ConditionUpdaterService,
              route: ActivatedRoute) {
    super(router, conditionObserverService, route);
  }

  ngOnInit() {
    this.init();
    this.newMatchForm = this.createFormGroup();
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: '',
      access: this.access,
      password: '',
      organization: this.organization,
      duration: '',
      areaRadius: '',
      maxPlayerNumber: '',
      centralPosition: '',
      latitude: '',
      longitude: ''
    });
  }

  switchAccess() {
    if (this.access == MatchAccess.PUBLIC) {
      this.access = MatchAccess.PRIVATE;
      this.passwordVisible = true;
    } else {
      this.access = MatchAccess.PUBLIC;
      this.passwordVisible = false;
    }
  }

  switchOrganization() {
    if (this.organization == MatchOrganization.SINGLE_PLAYER) {
      this.organization = MatchOrganization.TEAM;
    } else {
      this.organization = MatchOrganization.SINGLE_PLAYER;
    }
  }

  createMatch() {

    const formValues = this.newMatchForm.value;

    var position: Point;
    if (this.completeFunctionalities) {
      position = this.conditionUpdaterService.position;
    } else {
      position = new Point(formValues.latitude, formValues.longitude);
    }

    const match: Match = new Match(
      formValues.name,
      this.access,
      this.organization,
      position,
      formValues.areaRadius,
      new Date(),
      new Date(),
      formValues.duration,
      formValues.maxPlayerNumber,
      formValues.password,
      [],
      MatchState.SETTING_UP);

    this.matchConfigurationService.createNewMatch(match).subscribe(
      (data) => {
        LocalStorageHelper.setItem(StorageKey.MACTH, data);
        this.router.navigateByUrl("/matchInfo");
      },
      error =>
        alert(error)
    );

  }

  ngOnDestroy(): void {
    this.destroy();
  }

}
