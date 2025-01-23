import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from '../../models/user/user.type';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user-service/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UsersEditComponent } from '../users-edit/users-edit.component';
import { Booking } from '../../models/booking/booking.type';
import { BookingService } from '../../services/booking/booking.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatListModule, MatTabsModule, MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  tokenService = inject(TokenService);
  userService = inject(UserService);
  bookingService = inject(BookingService);
  dialog = inject(MatDialog);

  user: User = {} as User;
  token: string = this.tokenService.getToken()!;
  bookingsData: Booking[] = [];
  userBookings: Booking[] = [];
  displayedColumns: string[] = ['startDate', 'endDate', 'totalPrice', 'roomNumber'];
  showTable = false;

  ngOnInit(): void {
    this.loadUserAndBookings();
  }

  loadUserAndBookings(): void {
    this.loadUser().then(() => {
      this.getBookings();
    });
  }

  loadUser(): Promise<void> {
    return new Promise<void>((resolve) => {
      const emailFromToken = this.tokenService.getEmailFromToken(this.token);
      this.userService.getUsers().subscribe((users: User[]) => {
        const tempUser = users.find((user) => user.email === emailFromToken)!;
        this.user = {
          id: tempUser.id,
          firstName: tempUser.firstName,
          lastName: tempUser.lastName,
          email: tempUser.email,
          phoneNumber: tempUser.phoneNumber,
        };
        console.log('user', this.user);
        resolve();
      });
    });
  }

  getBookings(): void {
    this.bookingService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookingsData = bookings;
      this.getUserBookings();
      console.log('bookings', this.bookingsData);
    });
  }

  getUserBookings(): void {
    this.userBookings = this.bookingsData.filter((b) => b.bookerEmail === this.user.email);
    if (this.userBookings.length > 0) {
      this.showTable = true;
    }
    console.log('userBookings', this.userBookings);
  }

  onEditUser(user: User): void {
    const dialogRef = this.dialog.open(UsersEditComponent, {
      data: user,
    });
  }
}
