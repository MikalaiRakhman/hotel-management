import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpClient } from '@angular/common/http';
import { IRegisterRequest } from '../../interfaces/iregister-request';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private config = inject(ApiConfigService);
  private http = inject(HttpClient);
  
  async register(userData: IRegisterRequest) {
    try {
      return await firstValueFrom(this.http.post(`${this.config.apiAuthRegisterUrl}`, userData));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
