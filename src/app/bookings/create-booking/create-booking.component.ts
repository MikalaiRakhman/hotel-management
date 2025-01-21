import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { BookingService } from '../../services/booking/booking.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Booking } from '../../models/booking/booking.type';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UserService } from '../../services/user-service/user.service';
import { RoomService } from '../../services/room-service/room.service';
import { map, Observable } from 'rxjs';
import { User } from '../../models/user/user.type';
import { Room } from '../../models/room/room.type';
import { CreateBookingCommand } from '../../interfaces/i-create-booking-command';

@Component({
  selector: 'app-create-booking',
  imports: [CommonModule,
     MatButtonModule,
      MatDialogModule,
       MatFormFieldModule,
        FormsModule,
         MatInputModule,          
           MatSelectModule,
          MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent {
  bookingService = inject(BookingService);
  userService = inject(UserService);
  roomService = inject(RoomService);
  snackbar = inject(SnackbarService);

  startDate?: Date; 
  endDate?: Date; 
  clientEmail?: string; 
  roomNumber?: number;  

  usersData: User[] = [];
  roomsData: Room[] = [];

  booking: Booking;

  constructor(public dialogRef: MatDialogRef<CreateBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Booking
  ) {
    this.booking = { ...data}
  }
  
  getUsers(): void {
    this.userService.getUsers().subscribe( (users: User[]) => { this.usersData = users; });
  }

  getUserIdByEmail(users: User[], email: string): string | undefined {
    const user = users.find(u => u.email === email);
    return user?.id;
  }
  


  onSave(): void {
    this.getUsers();

    let id: string = this.getUserIdByEmail(this.usersData, this.clientEmail!)!

    const command: CreateBookingCommand = {
      userId: id!,
      roomId: "c97bcd20-d404-43c1-cbb9-08dd330f2d49",
      startDate: this.startDate!.toLocaleDateString('en-CA'),
      endDate: this.endDate!.toLocaleDateString('en-CA')
    }

    this.bookingService.createBooking(command)
    .subscribe({
      next: () => {
        this.dialogRef.close();
        window.location.reload();
      },
      error: err => this.snackbar.showError(err),
    });    
  }

  onClose(): void {
    // close
  }
}
