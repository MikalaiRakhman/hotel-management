import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule} from '@angular/material/table'
import { User } from '../../models/user.type'
import { UserService } from '../../services/user-service/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog'
import { UsersEditComponent } from '../users-edit/users-edit.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../services/snackbar/snackbar.service';


@Component({
  selector: 'app-users-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService);
  snackbar = inject(SnackbarService)
  dialog = inject(MatDialog)

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'actions']
  users = signal<Array<User>>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data: Array<User>) => {this.users.set(data)})
  }

  onEditUser(user: User): void {
    const dialogRef = this.dialog.open(UsersEditComponent, {
      data: user,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User data after edit', result);
        this.loadUsers();
      }
    })
  }

  onDeleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm deletion',
        message: 'Are you sure you want to delete this user?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            console.log('user deleted');
            this.snackbar.showError('test');
          },
          error: err => {
            console.error('Error occured whilst deleting a user', err);
            this.snackbar.showError(err);
          },
        });
      }
    });
  }
}
