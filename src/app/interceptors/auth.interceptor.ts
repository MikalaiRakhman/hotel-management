import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { inject } from "@angular/core";
import { TokenService } from "../services/token.service";

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(cloned).pipe(
            catchError(error => {
                if (error.status === 401) {
                    const refreshToken = tokenService.getRefreshToken();

                    if(refreshToken) {
                        const newRequest = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${refreshToken}`
                            }
                        });

                        return next(newRequest);
                    }
                }
                return throwError(() => error);                
            })
        );
    }
    return next(req);
}