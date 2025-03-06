import { HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs';

export const delayInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const DELAY_TIME = 0;
  return next(req).pipe(delay(DELAY_TIME));
};
