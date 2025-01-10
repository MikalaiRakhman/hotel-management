import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule} from '@angular/material/table'
import { User } from '../../models/user.type'
import { UserService } from '../../services/user-service/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog'
import { UsersEditComponent } from '../users-edit/users-edit.component';

@Component({
  selector: 'app-users-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService);
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
}
