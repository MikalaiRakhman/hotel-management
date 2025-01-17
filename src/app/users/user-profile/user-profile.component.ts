import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from '../../models/user/user.type';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [MatCardModule, MatIconModule, MatListModule, MatTabsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  tokenService = inject(TokenService);
  userService = inject(UserService);

  user: User = {} as User;
  token: string = this.tokenService.getToken()!;

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const emailFromToken = this.tokenService.getEmailFromToken(this.token);
    this.userService.getUsers().subscribe((users: User[]) => {
      const tempUser = users.find(user => user.email === emailFromToken)!;

      this.user = {
        id: tempUser.id,
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        email: tempUser.email,
        phoneNumber: tempUser.phoneNumber,
      };
    });
  }
    
}
