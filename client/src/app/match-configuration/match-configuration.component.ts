import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Match, MatchAccess, MatchOrganization, MatchState} from "../../models/match";
import {MatchConfigurationService} from "../../services/match-configuration.service";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";

@Component({
  selector: 'app-match-configuration',
  templateUrl: './match-configuration.component.html',
  styleUrls: ['./match-configuration.component.css']
})
export class MatchConfigurationComponent implements OnInit {

  newMatchForm: FormGroup;

  access: MatchAccess = MatchAccess.PUBLIC;
  passwordVisible = false;
  organization: MatchOrganization = MatchOrganization.SINGLE_PLAYER;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private matchConfigurationService: MatchConfigurationService) {
    this.newMatchForm = this.createFormGroup();
  }

  ngOnInit() {
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: '',
      access: this.access,
      password: '',
      organization: this.organization,
      duration: '',
      areaRadius: '',
      maxPlayerNumber: ''
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

  createNewMatch() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
          this.createMatch(pos);
        },
        error => console.log(error),
        {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
    }

  }

  createMatch(position) {

    const formValues = this.newMatchForm.value;

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

}
