import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = "Shoot Them All";

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    alert("ooooooh chiiiiccoooo")
    this.loginService.fetchData();
  }

}
