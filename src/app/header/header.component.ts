import { Component, inject } from '@angular/core';
import { MatToolbarModule} from '@angular/material/toolbar'
import { MatButtonModule} from '@angular/material/button'
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule ,MatToolbarModule, MatButtonModule, RouterLink, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  authService = inject(AuthService);

  constructor(private router: Router) {
      
   }

   goToUserProfile(): void {
     this.router.navigate(['profile']);
   }

   onLogout(): void {
      this.authService.Logout();
      this.router.navigate(['']);
   }

   isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  isUser(): boolean {
    return this.authService.isRoleUser();
  }

  isAdmin(): boolean {
    return this.authService.isRoleAdmin();
  }

  isLoggedInAdmin(): boolean {
    return this.isLoggedIn() && this.isAdmin();
  }

  isLoggedInUser(): boolean {
    return this.isLoggedIn() && this.isUser();
  }
}
