import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  // Método que verifica si hay un token en localStorage
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    
    if (token) {
      return true; // Si el token existe, permite el acceso a la ruta
    } else {
      this.router.navigate(['/main']); // Si no hay token, redirige al login
      return false;
    }
  }
}
