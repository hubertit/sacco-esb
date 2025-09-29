import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth for login and refresh endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Add auth token to request
  const authReq = addAuthHeader(req, authService);
  return next(authReq);
};

function isAuthEndpoint(url: string): boolean {
  return url.includes(API_ENDPOINTS.AUTH.LOGIN) || 
         url.includes(API_ENDPOINTS.AUTH.REFRESH);
}

function addAuthHeader(req: any, authService: AuthService): any {
  const token = authService.getAccessToken();
  if (token) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return req;
}