import { Component, inject } from '@angular/core';
import { MatToolbarModule} from '@angular/material/toolbar'
import { MatButtonModule} from '@angular/material/button'
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth-service/auth.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, RouterLink, MatIconModule],
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
}
