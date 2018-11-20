import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {UserData} from "../../models/user";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {ErrorStateMatcher} from "@angular/material";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  username = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  password = new FormControl('', Validators.required);

  matcher = new MyErrorStateMatcher();

  hide = true;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService) {
  }


  ngOnInit() {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup() {
    return this.formBuilder.group({
      username: '',
      password: ''
    });
  }

  login() {
    const userData: UserData = Object.assign({}, this.loginForm.value);

    this.loginService.login(userData).subscribe(() => {
      LocalStorageHelper.setItem(StorageKey.USERNAME, userData.username);
      this.router.navigateByUrl('/home');
    }, (err) => {
      alert(err);
    });

  }

}
