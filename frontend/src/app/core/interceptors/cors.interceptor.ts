import { HttpInterceptorFn } from '@angular/common/http';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  // Add CORS headers to all requests
  const corsReq = req.clone({
    setHeaders: {
      'Origin': window.location.origin,
      'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
  });

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return next(corsReq);
  }

  return next(corsReq);
};
