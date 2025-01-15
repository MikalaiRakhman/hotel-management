import { inject } from "@angular/core";
import { SnackbarService } from "../services/snackbar/snackbar.service";
import { ErrorHandlerService } from "../services/error-handler/error-handler.service";
import { Router } from "@angular/router";
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

export const errorHandlerInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const snackbarService = inject(SnackbarService);
    const errorHandlerService = inject(ErrorHandlerService);
    const router = inject(Router);
  
    return next(req).pipe(
      catchError(error => {
        const handledError = errorHandlerService.handleError(error);
  
        if (error.status === 500 || error.status === 0) {
          router.navigate(['/error']);
        }
        else {
          snackbarService.showError(handledError);
        }        
  
        return throwError(() => handledError);
      })
    );
  };