import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {UserData} from "../../models/user";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {animate, animation, state, style, transition, trigger} from "@angular/animations";
import {DefaultErrorStateMatcher} from "../../models/DefaultErrorStateMatcher";
export interface DialogData {
  error: string;
  message: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('scan', [
      state('inactive', style({
      })),
      state('active', style({
        transform: 'translateY(90px)'
      })),
      transition('inactive => active', [
        animate(500)
      ]),
      transition('active => inactive', [
        animate(1)
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  username = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  password = new FormControl('', Validators.required);

  matcher = new DefaultErrorStateMatcher();

  showPassword = false;
  showScanner = false;

  scanning = false;
  scanTimeoutId;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private loginService: LoginService,
              private dialog:MatDialog) {
  }

  ngOnInit() {
    this.loginForm = this.createFormGroup();
    this.setScanner();
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
      this.openDialog("Login Error",err);
      // alert(err);''
    });

  }

  setScanner() {
    this.showScanner = ('ontouchstart' in document.documentElement);
  }

  startScan() {
    this.scanning = true;
    this.scanTimeoutId = window.setTimeout(() => {
      this.stopScan();
      this.login();
    }, 500);
  }

  stopScan() {
    window.clearTimeout(this.scanTimeoutId);
    this.scanning = false;
  }

  openDialog(error:string,message:string): void {
    const dialogRef = this.dialog.open(MaterialDialog, {
      width: '250px',
      data: {error: error, message: message}
    });

  }
}
@Component({
  selector: 'material-dialog',
  templateUrl: 'material-dialog.html',
  styleUrls: ['./material-dialog.css']
})
export class MaterialDialog{

  constructor(
    public dialogRef: MatDialogRef<MaterialDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
