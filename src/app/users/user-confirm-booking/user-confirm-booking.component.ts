import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { Room } from '../../models/room/room.type';
import { TokenService } from '../../services/token.service';
import { RoomService } from '../../services/room-service/room.service';

@Component({
  selector: 'app-user-confirm-booking',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './user-confirm-booking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-confirm-booking.component.css'
})
export class UserConfirmBookingComponent implements OnInit
 {
  tokenService = inject(TokenService);
  roomService = inject(RoomService);

  room: Room;


  constructor(
      public dialogRef: MatDialogRef<UserConfirmBookingComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Room
    ) {
      this.room = { ...data };
    }

  ngOnInit(): void {    
    this.room;
  }


  calculateTotalDays(checkInDay: Date, checkOutDay: Date): number {
    const diffTime = Math.abs(checkOutDay.getTime() - checkInDay.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }  
}
