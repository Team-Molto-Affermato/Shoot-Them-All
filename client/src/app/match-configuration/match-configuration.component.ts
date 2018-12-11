import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {Match, MatchAccess, MatchOrganization, MatchState} from "../../models/match";
import {MatchConfigurationService} from "../../services/match-configuration.service";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {Point} from "../../models/point";
import {ConditionUpdaterService} from "../../services/condition-updater.service";
import {AbstractObserverComponent} from "../ObserverComponent";
import {drawParticles} from "../../assets/scripts/particles";

@Component({
  selector: 'app-match-configuration',
  templateUrl: './match-configuration.component.html',
  styleUrls: ['./match-configuration.component.scss']
})
export class MatchConfigurationComponent extends AbstractObserverComponent implements OnInit, OnDestroy {
  nameFormGroup: FormGroup;
  accessFormGroup: FormGroup;
  playerFormGroup: FormGroup;
  durationFormGroup: FormGroup;
  positionFormGroup: FormGroup;
  policies: String[] = ["Public","Private"];
  defaultPolicy:String = "Public";
  organizations: String[] = ["Single Player","Team"];
  defaultOrganization = "Single Player";
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

    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);

    this.newMatchForm = this.createFormGroup();
    this.nameFormGroup = this.formBuilder.group({
      nameCtrl: ['', Validators.required]
    });
    this.accessFormGroup = this.formBuilder.group({
      accessCtrl: '',
      pwdCtrl: ''
    });
    this.playerFormGroup = this.formBuilder.group({
      orgCtrl: '',
      playersCtrl: ''
    });
    this.durationFormGroup = this.formBuilder.group({
      durationCtrl: ''
    });
    this.positionFormGroup = this.formBuilder.group({
      areaCtrl: '',
      latitudeCtrl: '',
      longitudeCtrl: ''
    });
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

    // const formValues = this.newMatchForm.value;
    const positionsForm = this.positionFormGroup.value
    var position: Point;
    if (this.completeFunctionalities) {
      position = this.conditionUpdaterService.position;
    } else {
      position = new Point(positionsForm.latitudeCtrl, positionsForm.longitudeCtrl);
    }

    const match: Match = new Match(
      this.nameFormGroup.value.nameCtrl,
      this.access,
      this.organization,
      position,
      positionsForm.areaCtrl,
      new Date(),
      new Date(),
      this.durationFormGroup.value.durationCtrl,
      this.playerFormGroup.value.playersCtrl,
      this.accessFormGroup.value.pwdCtrl,
      // [],
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
