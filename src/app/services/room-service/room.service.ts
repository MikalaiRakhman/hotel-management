import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { Room } from '../../models/room/room.type';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RoomUpdate } from '../../models/room/room-update';
import { RoomCreate } from '../../models/room/room-create';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  http = inject(HttpClient);
  api = inject(ApiConfigService);

  createRoom(room: RoomCreate): Observable<void> {
    return this.http.post<void>(`${this.api.roomsUrl}`, room)
    .pipe(catchError(this.handleError));
  }

  getRooms(): Observable<Array<Room>>{
    return this.http.get<Array<Room>>(this.api.roomsUrl)
    .pipe(catchError(this.handleError));
  }

  updateRoom(id: string, room: RoomUpdate): Observable<void> {
    return this.http.put<void>(`${this.api.roomsUrl}/${id}`, room)
    .pipe(catchError(this.handleError));
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.roomsUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
      console.error('Error occured!', error);

      return throwError(error);  
  }
}