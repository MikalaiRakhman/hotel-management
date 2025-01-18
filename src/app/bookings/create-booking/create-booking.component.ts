import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'app-create-booking',
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBookingComponent {
  startDate: Date = new Date();
  endDate: Date = new Date();  
  dateForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  })

  constructor() {
    
  }
  
  onSaveDate(): void {
    this.startDate = this.dateForm.get('startDate')!.value;
    this.endDate = this.dateForm.get('endDate')!.value;
    console.log(this.startDate);
    console.log(this.endDate);
  }

  saveBooking(): void {
    // save booking
  }

  cancelBooking(): void {
    // cancel booking
  }
}
