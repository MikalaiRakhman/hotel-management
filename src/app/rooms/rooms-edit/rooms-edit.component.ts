import { Component, Inject, inject } from '@angular/core';
import { RoomService } from '../../services/room-service/room.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Room } from '../../models/room/room.type';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-rooms-edit',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatOption, MatSelectModule],
  templateUrl: './rooms-edit.component.html',
  styleUrl: './rooms-edit.component.css'
})
export class RoomsEditComponent {
  roomService = inject(RoomService);
  snackbar = inject(SnackbarService);

  room: Room;

  checkInDay?: Date;
  checkOutDay?: Date;

  constructor(
    public dialogRef: MatDialogRef<RoomsEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.room = { ...data };
  }

  onSave(): void {
    this.roomService
      .updateRoom(this.room.id, {
        id: this.room.id,
        roomNumber: Number(this.room.roomNumber),
        roomType: Number(this.room.roomType),
        pricePerNight: Number(this.room.pricePerNight),        
      })
      .subscribe({
        next: () => {
          this.dialogRef.close(this.room);
        },
        error: err => this.snackbar.showError(err),
      });    
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

