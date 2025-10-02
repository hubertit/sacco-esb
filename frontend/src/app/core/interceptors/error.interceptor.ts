import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HTTP_STATUS } from '../constants/api.constants';
import { ApiError } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 403 Forbidden - Token expired
      if (error.status === HTTP_STATUS.FORBIDDEN) {
        console.log('🚫 Token expired (403) - Logging out user');
        const authService = inject(AuthService);
        authService.logout();
        return throwError(() => new Error('Your session has expired. Please sign in again to continue.'));
      }
      
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
          message: getErrorMessage(error),
          dateTime: new Date().toISOString()
        };
      }

      console.error('API Error:', apiError);
      return throwError(() => apiError);
    })
  );
};

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    return error.error.message;
  } else {
    // Server-side error
    switch (error.status) {
      case HTTP_STATUS.BAD_REQUEST:
        return 'Please check your information and try again.';
      case HTTP_STATUS.UNAUTHORIZED:
        return 'You need to sign in to access this feature.';
      case HTTP_STATUS.FORBIDDEN:
        return 'You do not have permission to perform this action.';
      case HTTP_STATUS.NOT_FOUND:
        return 'The information you requested could not be found.';
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return 'Something went wrong on our end. Please try again in a moment.';
      default:
        return error.error?.message || error.message || 'Something unexpected happened. Please try again.';
    }
  }
}