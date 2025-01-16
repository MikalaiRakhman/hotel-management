import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpClient } from '@angular/common/http';
import { IRegisterRequest } from '../../interfaces/iregister-request';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ILoginRequest } from '../../interfaces/ilogin-request';

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

  login(userData: ILoginRequest) {
    try {
    return firstValueFrom(this.http.post<{token: string, refreshToken: string}>(`${this.config.apiAuthLoginUrl}`, userData));
    } catch (error) {
      console.error('Login error',error);
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  Logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('authToken')) {
      return true;
    }
    else {
      return false;
    }
  }
}