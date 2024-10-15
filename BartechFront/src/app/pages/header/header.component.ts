import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  logout() {
    // Limpiar los datos almacenados del usuario
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    // Redirigir al usuario a la página de login
    this.router.navigate(['/main']);
  }
  
}
