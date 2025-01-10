import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.type'
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../api-config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  api = inject(ApiConfigService);
  

  getUsers(): Observable<Array<User>>{
    return this.http.get<Array<User>>(this.api.usersUrl);
  }
}
