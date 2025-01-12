import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Booking } from '../../models/booking/booking.type';
import { BookingService } from '../../services/booking/booking.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bookings-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.css'
})
export class BookingsListComponent implements OnInit{
  bookingService = inject(BookingService);
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'startDate', 'endDate', 'totalPrice', 'actions'];
  bookings = signal<Array<Booking>>([]);

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe((data: Array<Booking>) =>
    {this.bookings.set(data)});
  }

}
