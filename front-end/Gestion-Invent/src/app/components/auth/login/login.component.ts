import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  private authUrl = 'http://localhost:8081/auth/login';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.http.post<{ token: string }>(this.authUrl, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        const token = res.token;
        // Decode token payload to extract username and roles
        let roles: string[] = [];
        let username = this.username;
        try {
          const payloadPart = token.split('.')[1];
          const decoded = JSON.parse(atob(payloadPart));
          if (decoded.sub) {
            username = decoded.sub;
          }
          if (decoded.roles) {
            roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
          }
        } catch {

        }

        // If backend doesn't embed roles, fall back to empty list
        this.authService.setAuth(token, username, roles);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}


