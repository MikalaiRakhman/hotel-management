import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { BookingService } from '../../services/booking/booking.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Booking } from '../../models/booking/booking.type';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UserService } from '../../services/user-service/user.service';
import { RoomService } from '../../services/room-service/room.service';
import { User } from '../../models/user/user.type';
import { Room } from '../../models/room/room.type';
import { CreateBookingCommand } from '../../interfaces/i-create-booking-command';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {
  bookingService = inject(BookingService);
  userService = inject(UserService);
  roomService = inject(RoomService);
  snackbar = inject(SnackbarService);

  startDate?: Date;
  endDate?: Date;
  clientEmail?: string;
  roomNum?: number;

  usersData: User[] = [];
  roomsData: Room[] = [];

  booking: Booking;

  constructor(
    public dialogRef: MatDialogRef<CreateBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Booking
  ) {
    this.booking = { ...data };
  }

  ngOnInit(): void {    
    this.getUsers();
    this.getRooms();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.usersData = users;
      console.log('Loaded users:', this.usersData);
    });
  }

  getUserIdByEmail(users: User[], email: string): string | undefined {
    const user = users.find(u => u.email === email);
    return user?.id;
  }

  getRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.roomsData = rooms;
      console.log('Loaded rooms:', this.roomsData);
    });
  }

  getRoomIdByNumber(rooms: Room[], num: number): string | undefined {
    const room = rooms.find(r => r.roomNumber === num);
    return room?.id;
  }

  onSave(): void {
    this.getRooms();
    let idU: string = this.getUserIdByEmail(this.usersData, this.clientEmail!)!;
    this.getUsers();    
    let idR: string = this.getRoomIdByNumber(this.roomsData, this.roomNum!)!;  
  
    console.log('Client Email:', this.clientEmail);
    console.log('User ID:', idU);
    console.log('Room Number:', this.roomNum);
    console.log('Room ID:', idR);
  
    const command: CreateBookingCommand = {
      userId: idU!,
      roomId: idR!,
      startDate: this.startDate!.toLocaleDateString('en-CA'),
      endDate: this.endDate!.toLocaleDateString('en-CA')
    };
  
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
    this.dialogRef.close();
  }
}
