import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const token = localStorage.getItem('token') ?? null
  let request = req;
  if (token) {
    request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }
  loadingService.show();
  return next(request).pipe(
    finalize(() => loadingService.hide())
  );
};
