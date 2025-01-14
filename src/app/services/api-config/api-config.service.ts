import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl = 'https://localhost:7244/api';

  get apiUrl() {
    return this.baseUrl;
  }

  get usersUrl() {
    return `${this.baseUrl}/Users`;
  }

  get roomsUrl() {
    return `${this.baseUrl}/Rooms`;
  }

  get bookingsUrl() {
    return `${this.baseUrl}/Bookings`;
  }

  get apiAuthLoginUrl() {
    return `${this.baseUrl}/Auth/login`;
  }

  get apiAuthRegisterUrl() {
    return `${this.baseUrl}/Auth/register`;
  }
}
