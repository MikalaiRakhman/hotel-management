import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Booking } from '../../models/booking/booking.type';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  http = inject(HttpClient);
  api = inject(ApiConfigService);

  getBookings(): Observable<Array<Booking>> {
    return this.http.get<Array<Booking>>(this.api.bookingsUrl)
    .pipe(catchError(this.handleError));
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.bookingsUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
        console.error('Error occured!', error);
  
        return throwError(error);  
  }
}
