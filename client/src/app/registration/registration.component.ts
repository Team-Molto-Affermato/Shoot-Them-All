import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { User} from "../../models/user";
import {RegistrationService} from "../../services/registration.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {DefaultErrorStateMatcher} from "../../models/DefaultErrorStateMatcher";
import {MaterialDialog} from "../login/login.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {


  registrationForm: FormGroup;

  name = new FormControl('', Validators.required);
  surname = new FormControl('', Validators.required);
  username = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  confirmPassword = new FormControl('', Validators.required);

  matcher = new DefaultErrorStateMatcher();

  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private registrationService: RegistrationService,
              private dialog:MatDialog) {
    this.registrationForm = this.createFormGroup();
  }

  ngOnInit() {
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: '',
      surname: '',
      username: '',
      password: '',
      email: ''
    });
  }

  register() {
    // Make sure to create a deep copy of the form-model
    const user: User = Object.assign({}, this.registrationForm.value);

    this.registrationService.register(user).subscribe(() => {
      LocalStorageHelper.setItem(StorageKey.USERNAME, user.username);
      this.router.navigateByUrl('/home');
    }, (err) => {
      // alert(err);
        this.openDialog("Registration Error",err);
    });
  }
  openDialog(error:string,message:string): void {
    const dialogRef = this.dialog.open(MaterialDialog, {
      width: '250px',
      data: {error: error, message: message}
    });

  }

}
