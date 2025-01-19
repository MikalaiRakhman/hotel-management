import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking } from '../../models/booking/booking.type';
import { BookingService } from '../../services/booking/booking.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-bookings-list',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.css'
})
export class BookingsListComponent implements OnInit{
  bookingService = inject(BookingService);
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'startDate', 'endDate', 'totalPrice', 'bookerEmail', 'roomNumber', 'actions'];
  dataSource = new MatTableDataSource<Booking>();
  pagedBookings = new MatTableDataSource<Booking>();
  totalBookings: number = 0;
  pageSize: number = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe((bookings: Booking[]) => {
      this.dataSource.data = bookings;
      this.totalBookings = bookings.length;
      this.paginateBookings();
      this.dataSource.paginator = this.paginator;
    })
  }

  paginateBookings(event?: PageEvent): void {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : this.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.pagedBookings.data = this.dataSource.data.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.paginateBookings(event);
  }
}
