import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(userName: string, password: string): void {
    const loginData = {
      userName: userName,
      password: password,
    };
    
    this.http.post(`${environment.CRUD_BARTECH}auth/V1/login`, loginData)
      .subscribe({
        next: (response: any) => {
          if (response.token) {
            // Guardar el token y el usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', userName);

            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: '¡Bienvenido a Bartech!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              // Redirigir a la página de listado de bares
              this.router.navigate(['/listarBares']);
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error en el inicio de sesión',
            text: 'Usuario o contraseña incorrectos. Inténtalo de nuevo.',
            icon: 'warning',
            showConfirmButton: true,
          });
        }
      });
  }
}
