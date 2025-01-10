import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  action: string = 'OK';

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, this.action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  showWarning(message: string): void {
    this.snackBar.open(message, this.action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, this.action, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
  }
}