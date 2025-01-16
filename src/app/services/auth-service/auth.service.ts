import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpClient } from '@angular/common/http';
import { IRegisterRequest } from '../../interfaces/i-register-request';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ILoginRequest } from '../../interfaces/i-login-request';
import { jwtDecode } from 'jwt-decode';
import { IJwtPayload } from '../../interfaces/i-jwt-payload';

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

  isRoleUser(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    return this.getRoleFromToken(this.getToken()!) === 'User';
  }

  isRoleAdmin(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    return this.getRoleFromToken(this.getToken()!) === 'Admin';
  }

  private getRoleFromToken(token: string): string {
    try {      
        const decoded: IJwtPayload = jwtDecode(token);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      }
      catch (error) { 
      console.error('Error decoding token:', error); 
      return '';
    }
  }
}