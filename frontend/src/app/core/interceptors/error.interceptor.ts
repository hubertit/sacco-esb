import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP_STATUS } from '../constants/api.constants';

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiError: ApiError = {
          status: error.status,
          message: this.getErrorMessage(error),
          timestamp: new Date().toISOString(),
          path: req.url
        };

        console.error('API Error:', apiError);
        return throwError(() => apiError);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case HTTP_STATUS.BAD_REQUEST:
          return 'Invalid request. Please check your input.';
        case HTTP_STATUS.UNAUTHORIZED:
          return 'You are not authorized to perform this action.';
        case HTTP_STATUS.FORBIDDEN:
          return 'Access denied. You do not have permission.';
        case HTTP_STATUS.NOT_FOUND:
          return 'The requested resource was not found.';
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          return 'Internal server error. Please try again later.';
        default:
          return error.error?.message || error.message || 'An unexpected error occurred.';
      }
    }
  }
}
