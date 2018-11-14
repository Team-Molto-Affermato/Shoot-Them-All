import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';

import { Socket } from '../shared/interfaces';
import {UserPosition} from "../models/point";
import {UserScore} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {Match} from "../models/match";
import {MatchConverterService} from "./match-converter.service";
import {Team} from "../models/team";

declare var io : {
  connect(url: string): Socket;
};

@Injectable()
export class DataService {

  socket: Socket;
  observer: Observer<number>;
  userObserver: Observer<Array<String>>;
  timeoutObserver: Observer<String>;
  positionObserver: Observer<Array<UserPosition>>;
  scoreObserver: Observer<Array<UserScore>>;
  leaderboardObserver: Observer<Array<UserScore>>;
  matchesObserver: Observer<Array<Match>>;
  constructor(private http:HttpClient,
              private matchConverter:MatchConverterService){

  }
  getMatches():Observable<Array<Match>>{
    this.socket.on('matches', (res) => {
      this.matchesObserver.next(
        res.matches.map(m=>this.matchConverter.jsonToClass(m))
      );
    });
    return this.createMatchesObservable();
  }
  getLeaderboard():Observable<Array<UserScore>>{
    this.socket.on('users-leaderboard', (res) => {
      this.leaderboardObserver.next(res);
    });
    return this.createLeaderboardObservable();
  }
  getScores():Observable<Array<UserScore>>{
    this.socket.on('users-score', (res) => {
      var scores = res.map(score =>
        new UserScore(score.username,score.score,Team[<string>score.team]));
      console.log("Data ",scores);
      this.scoreObserver.next(scores);
    });
    return this.createUserScoreObservable();
  }

  getPositions():Observable<Array<UserPosition>>{
    this.socket.on('users-pos', (res) => {
      this.positionObserver.next(res);
    });
    return this.createUserPosObservable();
  }

  getTimeouts():Observable<String>{
    this.socket.on('timeout', (res) => {
      this.timeoutObserver.next(res.message);
    });
    return this.createTimeoutObservable();
  }
  joinRoom(roomName,username):any{
    this.socket.emit('room',{
      room:roomName,
      user: username
    });
  }

  leaveRoom(roomName):any{
    this.socket.emit('leave',roomName);
  }
  getUsers() :Observable<Array<String>> {
    this.socket.on('users', (res) => {
      console.log("Ciaoooo");
      this.userObserver.next(res.users);
    });
    return this.createUserObservable();
  }
  getQuotes() : Observable<number> {
    var address;
    this.http.get("../../../configuration.json")
      .subscribe((data:any) => {
        address = data.json().address+":3000"
      },
      error => {
        address ='http://192.168.43.212:3000'
      });

    this.socket = socketIo(address);

    this.socket.on('data', (res) => {
      this.observer.next(res.data);
    });
    // this.socket.emit('message',{
    //   message:"Ciao Diego"
    // })
    return this.createObservable();
  }
  sendMessage(): any{
    this.socket.emit('message',{
      message:"Ciao Diego"
    })
  }
  createMatchesObservable() : Observable<Array<Match>> {
    return new Observable<Array<Match>>(observer => {
      this.matchesObserver = observer;
    });
  }
  createLeaderboardObservable() : Observable<Array<UserScore>> {
    return new Observable<Array<UserScore>>(observer => {
      this.leaderboardObserver = observer;
    });
  }
  createUserScoreObservable() : Observable<Array<UserScore>> {
    return new Observable<Array<UserScore>>(observer => {
      this.scoreObserver = observer;
    });
  }

  createUserPosObservable() : Observable<Array<UserPosition>> {
    return new Observable<Array<UserPosition>>(observer => {
      this.positionObserver = observer;
    });
  }

  createTimeoutObservable() : Observable<String> {
    return new Observable<String>(observer => {
      this.timeoutObserver = observer;
    });
  }
  createUserObservable() : Observable<Array<String>> {
    return new Observable<Array<String>>(observer => {
      this.userObserver = observer;
    });
  }
  createObservable() : Observable<number> {
    return new Observable<number>(observer => {
      this.observer = observer;
    });
  }
  sendMessageToRoom():any{
    this.socket.emit('room',"GrandeInverno");
    this.socket.on('message',function (data) {
        console.log(data);
    })
  }

  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }

}
