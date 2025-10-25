import { inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { SecurityService } from '../../services/security-service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

    const securityService = inject(SecurityService);

    const addToken = (request: HttpRequest<any>, token: string) => {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    };

    let token = securityService.getValidAccessToken();
    let handledRequest = req;

    if (token) {
        handledRequest = addToken(req, token);
    }

    return next(handledRequest).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401 && !handledRequest.url.includes('/auth/refresh')) {

                return securityService.refreshAccessToken().pipe(
                    switchMap((newAccessToken) => {
                        if (newAccessToken) {
                            return next(addToken(req, newAccessToken));
                        }

                        return throwError(() => error); 
                    }),
                    catchError((err) => {
                        
                        securityService.clearTokens();
                       
                        return throwError(() => err);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};