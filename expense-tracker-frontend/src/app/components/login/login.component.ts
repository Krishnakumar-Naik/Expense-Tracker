import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = { email: '', password: '' };
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.user).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert('Login Failed')
    });
  }
}
