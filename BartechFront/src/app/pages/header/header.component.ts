import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  logout(): void {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/main']);
  }
}
