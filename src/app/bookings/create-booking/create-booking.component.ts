import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Room } from '../../models/room/room.type';
import { RoomService } from '../../services/room-service/room.service';
import { BookingService } from '../../services/booking/booking.service';
import { interval, take } from 'rxjs';
import { Booking } from '../../models/booking/booking.type';




@Component({
  selector: 'app-create-booking',
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
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


  displayedColumns: string[] = ['roomNumber', 'roomType', 'pricePerNight', 'actions'];
  dataSource = new MatTableDataSource<Room>();
  pagedRooms = new MatTableDataSource<Room>();
  totalRooms: number = 0;
  pageSize: number = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadRooms();
  }
  
  onSaveDate(): void {
    this.startDate = this.dateForm.get('startDate')!.value;
    this.endDate = this.dateForm.get('endDate')!.value;
    console.log(this.startDate);
    console.log(this.endDate);
  }
  
  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.dataSource.data = rooms;
      this.totalRooms = rooms.length;
      this.paginateRooms();
      this.dataSource.paginator = this.paginator;
    });
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

  stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }    

  returnBookingsWhereDayOverlap(startDate: Date, endDate: Date): Booking[] {    
    let bookingsWhereDatesOverlap: Booking[] = [];
    this.bookingService.getBookings().subscribe((bookings) => {
      bookings.forEach((booking) => {
        const bookingStartDate = this.stringToDate(booking.startDate);
        const bookingEndDate = this.stringToDate(booking.endDate);
        if (this.datesOverlap(startDate, endDate, bookingStartDate, bookingEndDate)) {
          bookingsWhereDatesOverlap.push(booking);      
        }
      });
    });

    return bookingsWhereDatesOverlap;
  }
    
  

  paginateRooms(event?: PageEvent): void {
      const pageIndex = event ? event.pageIndex : 0;
      const pageSize = event ? event.pageSize : this.pageSize;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      this.pagedRooms.data = this.dataSource.data.slice(startIndex, endIndex);
    }
  
    onPageChange(event: PageEvent): void {
      this.paginateRooms(event);
    }


    private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
      return !(end1 < start2 || end2 < start1);
    }
}
