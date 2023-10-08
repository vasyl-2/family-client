import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('auth');

    if (!!token) {
      const authReq = req.clone({
        headers: req.headers.set(
          'authorization',
          `Bearer  ${token as string}`
        ),
      });

      return next.handle(authReq)
    }

    return next.handle(req);
  }
}
