import { Component, OnInit } from '@angular/core';
import {drawParticles} from "../../assets/scripts/particles";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {LocalStorageHelper, StorageKey} from "../../utilities/LocalStorageHelper";
import {BasicUserInfo, MatchCount, UserInLeaderboard, UserScore} from "../../models/user";
import {rankings} from "../../models/user";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  rankImgPath = "../../assets/images/ranks/chevron-1.png";
  topScore:number = 35000;
  position:string ="";
  isReadMode:boolean=true;
  updateUserInfoForm: FormGroup;
  username: string;
  basicUserInfo:BasicUserInfo = new BasicUserInfo("","","","",0);
  playedMatches:number = 0;
  level:number = 0;
  nextLevelScore:number = 0;
  rank:string = "";
  constructor(private formBuilder: FormBuilder,
              private http: HttpClient) {
    this.updateUserInfoForm = this.createFormGroup();
  }
  createFormGroup() {
    return this.formBuilder.group({
      name: '',
      surname: '',
      email: ''
    });
  }
  ngOnInit() {
    const canvasDiv = document.getElementById('particle-canvas');
    drawParticles(canvasDiv);
    this.username = LocalStorageHelper.getItem(StorageKey.USERNAME);
    this.http.get('api/users/'+this.username).subscribe(
      (data: BasicUserInfo)=>{
        this.basicUserInfo = data;
        this.basicUserInfo.score = Math.floor(this.basicUserInfo.score);
        this.level = this.getLevel(this.basicUserInfo.score);
        this.rank = this.getRankings(this.level);
        this.nextLevelScore = this.getNextLevelScore(this.level);
        this.rankImgPath = this.getRankImg(this.level);
      },err =>{
        console.log(err);
      });
    this.http.get('api/users/'+this.username+'/matches').subscribe(
      (data:MatchCount)=>{
        this.playedMatches = data.count;
      },err =>{
        console.log(err);
      });

    this.http.get('api/users/score').subscribe(
      (data: Array<UserScore>)=>{
        data.forEach(
          (v,index)=>{
            if(v.username===this.username){
              this.position = this.getPosition(index+1);
            }
          }
        );
      },err =>{
        console.log(err);
      });

  }
  getPosition(pos:number):string{
    return pos+"°";
  }
  private switchMode(){
    this.isReadMode = !this.isReadMode;
  }
  updateUserInfo(){
    console.log(this.updateUserInfoForm.value);
    var updatedInfo = this.updateUserInfoForm.value;
    if(updatedInfo.name===""){
      updatedInfo.name = this.basicUserInfo.name;
    }
    if(updatedInfo.surname===""){
      updatedInfo.surname = this.basicUserInfo.surname;
    }
    if(updatedInfo.email===""){
      updatedInfo.email = this.basicUserInfo.email;
    }
    this.http.put('api/users/'+this.username,updatedInfo).subscribe(
      (data: BasicUserInfo)=>{
        this.basicUserInfo = data;
    },err =>{
    });
  }
  getLevel(score:number):number{
    var level =  Math.floor(score/(this.topScore/14));
    return level>14?14:level<0?0:level;
  }
  getNextLevelScore(level:number):number{
    return (this.topScore/14)*(level+1);
  }
  getRankings(level:number):string {
    return rankings[level];
  }
  getRankImg(level:number):string{
    const uLevel = level+1;
    return '../../assets/images/ranks/chevron-'+uLevel+'.png'
  }

}
