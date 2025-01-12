import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { Room } from '../../models/room/room.type';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RoomUpdate } from '../../models/room/room-update';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  http = inject(HttpClient);
  api = inject(ApiConfigService);

  getRooms(): Observable<Array<Room>>{
    return this.http.get<Array<Room>>(this.api.roomsUrl)
    .pipe(catchError(this.handleError));
  }

  updateRoom(id: string, room: RoomUpdate): Observable<void> {
    return this.http.put<void>(`${this.api.roomsUrl}/${id}`, room)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
      console.error('Error occured!', error);

      return throwError(error);  
    }
  
}
