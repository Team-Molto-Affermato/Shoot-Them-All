import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RegistrationService} from "../../services/registration.service";
import {UserData} from "../../models/user";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = "Shoot Them All";

  loginForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService) {
     this.loginForm = this.createFormGroup();
  }


  ngOnInit() {
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
      this.router.navigateByUrl('/home');
    }, (err) => {
      alert(err);
    });

  }

}
