import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Booking } from '../../models/booking/booking.type';
import { BookingService } from '../../services/booking/booking.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CreateBookingComponent } from '../create-booking/create-booking.component';

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

  displayedColumns: string[] = ['startDate', 'endDate', 'totalPrice', 'bookerEmail', 'roomNumber', 'actions'];
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

  onCreateBooking(): void {
    const dialogRef = this.dialog.open(CreateBookingComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    })
  }

  onDeleteBooking(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '500px',
          data: {
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this booking?',
          },
        });
    
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.bookingService.deleteBooking(id).subscribe({
              next: () => {
                window.location.reload();
              },
              error: err => {
                console.error('Something went wrong. Booking not deleted.', err);
                this.snackbar.showError(err);
              },
            });
          }
        });
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
