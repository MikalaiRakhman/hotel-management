import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BookingService } from '../../services/booking/booking.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Booking } from '../../models/booking/booking.type';

@Component({
  selector: 'app-create-booking',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatFormFieldModule, FormsModule, MatInputModule, MatOption, MatSelectModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent {
  bookingService = inject(BookingService);
  snackbar = inject(SnackbarService);

  booking: Booking;

  constructor(public dialogRef: MatDialogRef<CreateBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Booking
  ) {
    this.booking = { ...data}
  }
  

  onSave(): void {
    // save
  }

  onClose(): void {
    // close
  }
}
