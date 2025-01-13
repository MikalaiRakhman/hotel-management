import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'The error occurred.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    }

    if (error.error?.errors) {
      const errorDetails = Object.values(error.error.errors).flat().join('\n');
      errorMessage = `Validation errors: ${errorDetails}`;
    }

    return errorMessage;
  }
}
