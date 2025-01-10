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
}
