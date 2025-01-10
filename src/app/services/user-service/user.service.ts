import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../../models/user.type'
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../api-config/api-config.service';
import { UserUpdate } from '../../models/user-update.type';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  http = inject(HttpClient);
  api = inject(ApiConfigService);
  

  getUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(this.api.usersUrl).pipe(catchError(this.handleError));
  }

  updateUser(id: string, user: UserUpdate): Observable<void> {
    return this.http.put<void>(`${this.api.usersUrl}/${id}`, user).pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.usersUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Error occured!', error);

    return throwError(error);
  }
}
