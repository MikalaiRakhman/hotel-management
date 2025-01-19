import {MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { Room } from '../../models/room/room.type';
import { RoomService } from '../../services/room-service/room.service';
import { BookingService } from '../../services/booking/booking.service';
import { Booking } from '../../models/booking/booking.type';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-create-booking',
  imports: [CommonModule ,MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CreateBookingComponent implements OnInit {
  roomService = inject(RoomService);
  bookingService = inject(BookingService);

  startDate: Date = new Date();
  endDate: Date = new Date();  
  dateForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  })

  dateSelected: boolean = false;

  displayedColumns: string[] = ['roomNumber', 'roomType', 'pricePerNight', 'actions'];
  rooms = signal<Room[]>([]);
  

  
  ngOnInit(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      const roomNumbers = this.getFilteredBookings().map(b => b.roomNumber);
      const filteredRooms = rooms.filter(room => !roomNumbers.includes(room.roomNumber));
      this.rooms.set(filteredRooms);
    });
}

  
  onSaveDate(): void {
    this.startDate = this.dateForm.get('startDate')!.value;
    this.endDate = this.dateForm.get('endDate')!.value;
    console.log(this.startDate);
    console.log(this.endDate);    
    this.dateSelected = true;      
  }

  

  getFilteredBookings(): Booking[] {
    let filteredBookings: Booking[] = [];
    const startDate = this.startDate;
    const endDate = this.endDate;

    this.bookingService.getBookings().subscribe((bookings: Booking[]) => {
        bookings.filter(b => {
          if (!this.datesOverlap(startDate, endDate, this.stringToDate(b.startDate), this.stringToDate(b.endDate))) {
            filteredBookings.push(b);            
          }
        })
      }
    )

    return filteredBookings;
  }

  roomNumbersFromFilteredBookings(): number[] {
    let num: number[] = [];
    let filteredBookings = this.getFilteredBookings();
    filteredBookings.map(b => {
      num.push(b.roomNumber)
      
    });
    return num;
  }

  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return (end1 <= start2 || end2 <= start1);
  }
 

  saveBooking(): void {
    // save booking
  }

  cancelBooking(): void {
    // cancel booking
  }

  onChooseThisRoom(): void {
    // choose room that is available at the time
  }
}