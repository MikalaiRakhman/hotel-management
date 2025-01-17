import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { IJwtPayload } from '../interfaces/i-jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getRoleFromToken(token: string): string {
    try {      
        const decoded: IJwtPayload = jwtDecode(token);
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      }
      catch (error) { 
      console.error('Error decoding token:', error); 
      return '';
    }
  }

  getEmailFromToken(token: string): string {
    try {
      const decoded: IJwtPayload = jwtDecode(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }
}
