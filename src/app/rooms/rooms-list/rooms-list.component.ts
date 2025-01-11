import { Component, inject, OnInit, signal } from '@angular/core';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RoomService } from '../../services/room-service/room.service';
import { Room } from '../../models/room/room.type';

@Component({
  selector: 'app-rooms-list',
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  roomService = inject(RoomService);
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'roomNumber', 'roomType', 'pricePerNight', 'isAvailable'];
  rooms = signal<Array<Room>>([]);

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((data: Array<Room>) =>
      {this.rooms.set(data)})
  }  
}
