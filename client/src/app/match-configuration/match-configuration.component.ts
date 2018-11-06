import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Match, MatchAccess, MatchState} from "../../models/match";
import {Point} from "../../models/point";
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

  createNewMatch() {
    const formValues = this.newMatchForm.value;

    const match: Match = new Match(
      formValues.name, this.access, new Point(0, 0), formValues.areaRadius,
      new Date(), new Date(), formValues.duration, formValues.maxPlayerNumber, formValues.password, [], MatchState.SETTING_UP);

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
