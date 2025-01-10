import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule} from '@angular/material/table'
import { User } from '../../models/user.type'
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-users-list',
  imports: [MatTableModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  userService = inject(UserService);

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
  users = signal<Array<User>>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data: Array<User>) => {this.users.set(data)})
  }
}
