import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../interfaces/ilogin-request';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
    loginForm: FormGroup;
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    hidePassword = true;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    async onLogin(): Promise<void> {
      if(this.loginForm.valid) {
        const formValues: ILoginRequest = this.loginForm.value;

        try {
          const response = await this.authService.login(formValues).then(response => {
            localStorage.setItem('authToken', response.token),
            localStorage.setItem('refreshToken', response.refreshToken)
          });
          console.log('Login successful', response);
          this.router.navigate(['']);
        } catch (error) {
          console.error('Login error', error);
        }
      }
      else {
        console.warn('Form is invalid');
      }
    }

    togglePasswordVisibility(): void {
      this.hidePassword = !this.hidePassword;
    }
}
