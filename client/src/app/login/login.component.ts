import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RegistrationService} from "../../services/registration.service";
import {TokenPayload, User} from "../../models/user";
import {UserData} from "../../models/userData";
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
              private auth: AuthenticationService) {
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
    const userData: TokenPayload = Object.assign({}, this.loginForm.value);

    this.auth.login(userData).subscribe(() => {
      this.router.navigateByUrl('/home');
    }, (err) => {
      console.error(err);
    });

    // this.loginService.fetchData(userData).subscribe(
    //   (data: boolean) => {
    //     alert(data);
    //     if(data) {
    //       this.router.navigate(["/home"])
    //     }
    //
    //   },
    //    error => alert(error)
    // );

  }

}
