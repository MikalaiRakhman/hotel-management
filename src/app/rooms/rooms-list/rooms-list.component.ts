import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RoomService } from '../../services/room-service/room.service';
import { Room } from '../../models/room/room.type';
import { RoomsEditComponent } from '../rooms-edit/rooms-edit.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { RoomsCreateComponent } from '../rooms-create/rooms-create.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-rooms-list',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  roomService = inject(RoomService);
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'roomNumber', 'roomType', 'pricePerNight', 'isAvailable', 'actions'];
  dataSource = new MatTableDataSource<Room>();
  pagedRooms = new MatTableDataSource<Room>();
  totalRooms: number = 0;
  pageSize: number = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadRooms();
  }

  onCreateRoom(): void {
    const dialogCreate = this.dialog.open(RoomsCreateComponent);

    dialogCreate.afterClosed().subscribe( result => {
      if (result) {
        console.log('New room created', result);
      }
    })
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.dataSource.data = rooms;
      this.totalRooms = rooms.length;
      this.paginateRooms();
      this.dataSource.paginator = this.paginator;
    });
  }

  onEditRoom(room: Room): void {
    const dialogRef = this.dialog.open(RoomsEditComponent, {
      data: room,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Room data after edit', result);
      }
    })
  }

  onDeleteRoom(roomId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm deletion',
        message: 'Are you sure you want to delete this room?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.roomService.deleteRoom(roomId).subscribe({
          next: () => {
            console.log('room deleted');
          },
          error: err => {
            console.error('Something went wrong. Room not deleted.', err);
            this.snackbar.showError(err);
          },
        });
      }
    });
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
}
