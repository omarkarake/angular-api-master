import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-token`,
      },
    });

    // Log the outgoing request
    console.log('Outgoing request:', authReq);

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            // Log the incoming response
            console.log('Incoming response:', event);
          }
        },
        error: (error: HttpErrorResponse) => {
          // Log the error response
          console.error('Error response:', error);
        },
      })
    );
  }
}
