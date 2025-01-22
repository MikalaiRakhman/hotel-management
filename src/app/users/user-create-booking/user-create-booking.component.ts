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


@Component({
  selector: 'app-user-create-booking',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, FormsModule, MatPaginatorModule, CommonModule, MatTableModule, MatSortModule],
  templateUrl: './user-create-booking.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './user-create-booking.component.css'
})
export class UserCreateBookingComponent implements OnInit, AfterViewInit{  
  tokenService = inject(TokenService);
  userService = inject(UserService);
  roomService = inject(RoomService);
  bookingService = inject(BookingService);

  checkInDay?: Date;
  checkOutDay?: Date;
  token: string = this.tokenService.getToken()!;

  usersData: User[] = [];
  userId: string = '';
  roomsData: Room[] = [];
  filteredRoomsData: Room[] = [];
  bookingsData: Booking[] = [];
  filteredBookingsData: Booking[] = [];
  roomNumbersFromFilteredBookingsData: number[] = [];
  pagedFilteredRoomsData = new MatTableDataSource<Room>();
  totalRooms: number = 0;
  pageSize: number = 5;
  displayedColumns: string[] = ['roomNumber', 'roomType', 'pricePerNight', 'isAvailable', 'actions'];
  private _liveAnnouncer = inject(LiveAnnouncer);

  showTable: boolean = false;
  user?: User;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getUsers();
    this.getCurrentUserId();
    this.getUserWithId(this.userId);
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
  }

  loadFilteredRooms(): void {
    this.totalRooms = this.filteredRoomsData.length;
    this.paginateRooms();    
  }

  getCurrentUserId(): void {    
    this.userId = this.tokenService.getIdFromToken(this.token);
  }

  getUserWithId(id: string) {
    this.user = this.usersData.find(u => u.id == id);
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
