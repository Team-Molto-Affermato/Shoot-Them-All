import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';

import { Socket } from '../shared/interfaces';

declare var io : {
  connect(url: string): Socket;
};

@Injectable()
export class DataService {

  socket: Socket;
  observer: Observer<number>;
  userObserver: Observer<string[]>;

  joinRoom(roomName,username):any{
    this.socket.emit('room',{
      room:roomName,
      user: username
    });
  }
  leaveRoom(roomName):any{
    this.socket.emit('leave',roomName);
  }
  getUsers() :Observable<string[]> {
    this.socket.on('users', (res) => {
      this.userObserver.next(res);
    });
    return this.createUserObservable();
  }
  getQuotes() : Observable<number> {
    this.socket = socketIo('http://localhost:3000');

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
  createUserObservable() : Observable<string[]> {
    return new Observable<string[]>(observer => {
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
