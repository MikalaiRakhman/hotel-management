import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../services/auth-service/auth.service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(cloned).pipe(
            catchError(error => {
                if (error.status === 401) {
                    const refreshToken = authService.getRefreshToken();

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