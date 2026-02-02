import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';
  private readonly ROLES_KEY = 'auth_roles';

  // Save token + basic user info (username, roles as string[])
  setAuth(token: string, username: string, roles: string[]): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));
  }

  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.ROLES_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  getRoles(): string[] {
    const raw = localStorage.getItem(this.ROLES_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: 'ROLE_ADMIN' | 'ROLE_USER'): boolean {
    return this.getRoles().includes(role);
  }
}


