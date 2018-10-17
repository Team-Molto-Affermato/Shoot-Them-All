import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {User} from "../../models/register";
import {RegisterService} from "../../services/register.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private registerService: RegisterService) {
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

  onSubmit() {
    // Make sure to create a deep copy of the form-model
    const user: User = Object.assign({}, this.registrationForm.value);

    this.registerService.fetchData(user).subscribe(data => {
      for (var i in data) {
        alert(data[i]["name"]);
      }
    });
  }

}
