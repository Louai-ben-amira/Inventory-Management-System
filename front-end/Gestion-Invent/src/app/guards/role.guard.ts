import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRoles: string[] = route.data['roles'] || [];

    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login']);
    }

    if (expectedRoles.length === 0) {
      return true;
    }

    const userRoles = this.authService.getRoles();
    const hasRole = expectedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      // If user doesn't have role, redirect to home
      return this.router.createUrlTree(['/home']);
    }

    return true;
  }
}


