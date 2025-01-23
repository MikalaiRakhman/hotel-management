import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user/user.type';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { Room } from '../../models/room/room.type';
import { RoomService } from '../../services/room-service/room.service';
import { Booking } from '../../models/booking/booking.type';
import { BookingService } from '../../services/booking/booking.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { CreateBookingCommand } from '../../interfaces/i-create-booking-command';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create-booking',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, FormsModule, MatPaginatorModule, CommonModule, MatTableModule, MatSortModule, MatCardModule, MatChipsModule,],
  templateUrl: './user-create-booking.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './user-create-booking.component.css'
})
export class UserCreateBookingComponent implements OnInit, AfterViewInit{  
  tokenService = inject(TokenService);
  userService = inject(UserService);
  roomService = inject(RoomService);
  bookingService = inject(BookingService);
  dialog = inject(MatDialog);
  snackbar = inject(SnackbarService);
  router = inject(Router);

  checkInDay!: Date;
  checkInString!: string;
  checkOutDay!: Date;
  checkOutString!: string;
  token!: string;

  usersData: User[] = [];  
  roomsData: Room[] = [];
  filteredRoomsData: Room[] = [];
  bookingsData: Booking[] = [];
  filteredBookingsData: Booking[] = [];
  roomNumbersFromFilteredBookingsData: number[] = [];
  pagedFilteredRoomsData = new MatTableDataSource<Room>();
  totalRooms: number = 0;
  pageSize: number = 5;
  displayedColumns: string[] = ['roomNumber', 'roomType', 'pricePerNight', 'actions'];
  private _liveAnnouncer = inject(LiveAnnouncer);
  totalDays!: number;
  totalPrice!: number;
  room!: Room;
  

  showTable: boolean = false;
  showConfirm: boolean= false;
  user?: User;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {    
    this.getUsers();       
    this.getRooms();
    this.getBookings();    
  }

  ngAfterViewInit(): void {
    this.pagedFilteredRoomsData.sort = this.sort;
  }

  onConfirmDates(): void {
    this.getBookingsWhereDatesOverlap();
    this.getRoomNumbersFromFilteredBookings();
    this.getFilteredRoomsData();
    this.showTable = true;
    this.loadFilteredRooms();
    this.calculateTotalDays(this.checkInDay, this.checkOutDay);
  }

  onChoose(room: Room): void {
    this.room = room;
    this.showTable = false;
    this.showConfirm = true;
    this.checkInString = this.checkInDay.toISOString().split('T')[0];
    this.checkOutString = this.checkInDay.toISOString().split('T')[0];
    this.totalPrice = this.totalDays * room.pricePerNight;
    console.log('onChoose room', room);
  }
  getUserIdByEmail(users: User[], email: string): string | undefined {
    const user = users.find(u => u.email === email);
    return user?.id;
  }

  onCreateBooking(): void {
    const command: CreateBookingCommand = {
          userId: this.getUserIdByEmail(this.usersData, this.tokenService.getEmailFromToken(this.tokenService.getToken()!))!,
          roomId: this.room.id,
          startDate: this.checkInDay!.toLocaleDateString('en-CA'),
          endDate: this.checkOutDay!.toLocaleDateString('en-CA')
        };
      
        this.bookingService.createBooking(command)
        .subscribe({
          next: () => {            
            this.router.navigate(['/profile']);
          },
          error: err => this.snackbar.showError(err),
        });    
  }

  onCancel(): void {
    window.location.reload();
  }

  calculateTotalDays(startDate: Date, endDate: Date): void {
    const oneDayMilliseconds = 1000 * 60 * 60 * 24;
    const differenceMilliseconds = Math.abs(endDate.getTime() - startDate.getTime()); 
    const totalDays = Math.ceil(differenceMilliseconds / oneDayMilliseconds); 
    this.totalDays = totalDays;
  }

  loadFilteredRooms(): void {
    this.totalRooms = this.filteredRoomsData.length;
    this.paginateRooms();    
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.usersData = users;
      console.log('Loaded users:', this.usersData);
    });
  }

  getRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.roomsData = rooms;
      console.log('Load rooms:', this.roomsData);
    })
  }

  getBookings(): void {
    this.bookingService.getBookings().subscribe((bookings: Booking[]) => {
      this.bookingsData = bookings;
      console.log('Load bookings:', this.bookingsData);
    })
  }

  getBookingsWhereDatesOverlap(): void {
    this.filteredBookingsData = this.bookingsData.filter(booking => this.doDatesOverlap(this.checkInDay!, this.checkOutDay!, new Date(booking.startDate), new Date(booking.endDate)))
    console.log('Log filtered bookings', this.filteredBookingsData);
  }

  doDatesOverlap(startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date): boolean {
    return startDate1 <= endDate2 && startDate2 <= endDate1;
  }

  getRoomNumbersFromFilteredBookings(): void {
    this.roomNumbersFromFilteredBookingsData = this.filteredBookingsData.map(b => b.roomNumber);
    console.log('Log roomNumbers from filteredBookings', this.roomNumbersFromFilteredBookingsData);
  }

  getFilteredRoomsData(): void {
    this.filteredRoomsData = this.roomsData.filter(r => !this.roomNumbersFromFilteredBookingsData.includes(r.roomNumber));
    console.log('Log filteredRooms', this.filteredRoomsData);
  }

  getRoomTypeName(roomType: number): string {
    switch(roomType) {
      case 1:
        return 'Single';
      case 2:
        return 'Double';
      case 3:
        return 'King';
      case 4:
        return 'Suite';
      default:
        return 'Unknown';
    }
  }


  paginateRooms(event?: PageEvent): void {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : this.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.pagedFilteredRoomsData.data = this.filteredRoomsData.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.paginateRooms(event);
  }

  announceSortChange(sortState: Sort) {    
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }  
}
