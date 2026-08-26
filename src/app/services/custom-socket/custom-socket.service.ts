import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Observable} from "rxjs";

export enum SocketEvent {
  Connect = 'connect',
  Disconnect = 'disconnect',
  FROM_UI = 'from_ui'
}


@Injectable({
  providedIn: 'root',
})
export class CustomSocketService {

  // socketUrl = `${window.location.origin}/family-gateway/services/`;
  socketUrl = `127.0.0.1:3000/family-gateway/services/`;
  socketsMap = new Map<string, { socket: Socket, eventSet: Set<string> }>();

  constructor(

  ) {
    this.initSocket(this.socketUrl);
  }

  initSocket(url: string): void {
    if (this.socketsMap.has(url)) {
      return;
    }

    const socket = io(url, {
      upgrade: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      rememberUpgrade: true,
      secure: false,
      reconnectionDelay: 5000,
      // transports: ['websocket', 'polling'],
    });

    this.socketsMap.set(url, { socket, eventSet: new Set() });

    socket.on(SocketEvent.Connect, () => {
      console.log(`Connected to ${url}`);
    })

    socket.on(SocketEvent.Disconnect, () => {
      console.log(`Disconnected client ${url}`);
    })

    socket.onAny((eventName, args) => {
      console.log(`Received ${eventName}, ${args}`);
    })

  }

  getSocketData(socketId: string): { socket: Socket, eventSet: Set<string> } | undefined {
    return this.socketsMap.get(socketId);
  }

  onEvent(socketId: string, eventName: SocketEvent): Observable<any> {

    return new Observable<any>((subscriber) => {
      const socketData = this.getSocketData(socketId);

      socketData?.socket.on(eventName, (data: any) => {
        console.log('eventName:', eventName);

        try {
          subscriber.next(data);
        } catch (e) {
          console.log(`error:: ${e}`)
        }
      })

      socketData?.eventSet.add(eventName);
    })
  }
}
