import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private authenticationService: AuthenticationService) { }


  canActivate(): boolean {
    return true;
    if (!this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
      return false;
    }
    return true;
  }
}
