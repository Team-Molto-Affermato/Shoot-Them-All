import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {User} from "../../models/user";
import {RegistrationService} from "../../services/registration.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private registerService: RegistrationService) {
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

    this.registerService.fetchData(user).subscribe(
      (data: User) => {
        alert(data);
        this.router.navigate(["/home"])
      },
      error => alert(error)
    );
  }

}
