import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.type';
import { UserService } from '../../services/user-service/user.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-users-edit',
  imports: [CommonModule ,MatButtonModule ,MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.css'
})
export class UsersEditComponent {
  userService = inject(UserService);
  snackbar = inject(SnackbarService);

  user: User;

  constructor(
    public dialogRef: MatDialogRef<UsersEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = { ...data };
  }

  onSave(): void {
    this.userService
      .updateUser(this.user.id, {
        id: this.user.id,        
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(this.user);
        },
        error: err => this.snackbar.showError(err),
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
