import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inventory Management System';

  constructor(public authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.clearAuth();
    this.router.navigate(['/login']);
  }
}
