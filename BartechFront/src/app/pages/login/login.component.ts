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
  public userName: string = '';
  public password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    const loginData = {
      userName: this.userName,
      password: this.password,
    };

    this.http.post(`${environment.CRUD_BARTECH}auth/V1/login`, loginData)
      .subscribe({
        next: (response: any) => {
          // Verificar si la respuesta contiene el token
          if (response.token) {
            // Guardar el token en localStorage
            localStorage.setItem('token', response.token);

            // Mostrar el mensaje de éxito con Swal
            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: '¡Bienvenido a la plataforma!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              // Redirigir a la vista principal
              this.router.navigate(['/main']);
            });
          }
        },
        error: (err) => {
          // Si la respuesta es un error, mostrar alerta con Swal
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
