// src/app/services/token.service.ts
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { StorageService } from './storage.service';

interface DecodedToken {
  userId: string;
  email: string;
  exp: number; // expiration timestamp (seconds since epoch)
  iat: number; // issued at
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'nextjp.token';
  private storage = inject(StorageService);

  getToken(): string | null {
    return this.storage.local.getItem(this.TOKEN_KEY);
  }

  setToken(token: string) {
    return this.storage.local.setItem(this.TOKEN_KEY, token);
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('Failed to decode token', err);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded?.exp) return true;

    const now = Date.now() / 1000; // seconds
    return decoded.exp < now;
  }

  clearToken(): void {
    this.storage.local.removeItem(this.TOKEN_KEY);
  }
}
