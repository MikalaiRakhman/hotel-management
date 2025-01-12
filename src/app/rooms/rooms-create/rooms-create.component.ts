import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RoomService } from '../../services/room-service/room.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Room } from '../../models/room/room.type';

@Component({
  selector: 'app-rooms-create',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './rooms-create.component.html',
  styleUrl: './rooms-create.component.css'
})
export class RoomsCreateComponent {
  roomService = inject(RoomService);
  snackbar = inject(SnackbarService);

  room: Room;

  constructor(
    public dialogRef: MatDialogRef<RoomsCreateComponent>,
    @Inject (MAT_DIALOG_DATA) public data: Room
  ) {
    this.room = { ...data };
  }

  onSave(): void {
    this.roomService
      .createRoom({
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
