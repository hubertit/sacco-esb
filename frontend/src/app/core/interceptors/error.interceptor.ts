import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP_STATUS } from '../constants/api.constants';
import { ApiError } from '../models/auth.models';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let apiError: ApiError;
        
        // Handle API error response format
        if (error.error && error.error.message && error.error.dateTime) {
          apiError = {
            message: error.error.message,
            dateTime: error.error.dateTime
          };
        } else {
          // Handle generic HTTP errors
          apiError = {
            message: this.getErrorMessage(error),
            dateTime: new Date().toISOString()
          };
        }

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
