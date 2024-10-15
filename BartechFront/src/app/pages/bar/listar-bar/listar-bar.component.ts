import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'; // Opcional para manejo de alertas
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listar-bares',
  templateUrl: './listar-bar.component.html',
  styleUrls: ['./listar-bar.component.scss']
})
export class ListarBarComponent implements OnInit {
  bares: any[] = []; // Aquí almacenaremos los bares obtenidos
  token: string = ''; // Token almacenado
  userId: string = ''; // Variable para almacenar el ID del usuario actual

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Obtener el token y userID del localStorage
    this.token = localStorage.getItem('token') || '';
    this.userId = localStorage.getItem('userID') || '';
    console.log('1. userId' , this.userId);
    console.log('0.usuario :', localStorage.getItem('user'))
    // Verificar si el token existe y es válido
    if (!this.token) {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Inicia sesión para continuar.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redireccionar al login si no hay token
        window.location.href = '/main';
      });
      return;
    }

    // Si no hay userId, llamar a la función para obtener y almacenar el userId antes de realizar la petición GET
    if (!this.userId) {
      this.getUserId();
    } else {
      // Si ya existe el userId, obtener los bares
      this.getBares();
    }
  }

  getUserId(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get(`${environment.CRUD_BARTECH}user/V1`, { headers })
      .subscribe({
        next: (response: any) => {
          const storedUserName = localStorage.getItem('user');

          // Buscar el usuario en la lista de la respuesta
          const user = response.find((u: any) => u.userName === storedUserName);
          if (user) {
            this.userId = user.id;
            localStorage.setItem('userID', this.userId);
            this.getBares(); // Llamar a getBares después de obtener el userId
          } else {
            Swal.fire({
              title: 'Usuario no encontrado',
              text: 'No se encontró ningún usuario con ese nombre.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        },
        error: (err) => {
          if (err.status === 401) {
            Swal.fire({
              title: 'Sesión expirada',
              text: 'Inicia sesión nuevamente.',
              icon: 'warning',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.href = '/login';
            });
          } else {
            Swal.fire({
              title: 'Error al obtener usuarios',
              text: 'Hubo un error al intentar obtener los usuarios.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
  }

  // Función para obtener los bares del usuario a través de la petición GET
  getBares(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    console.log('2. userId dentro de getBares' , this.userId);
    // Realizamos la petición GET al endpoint con el userID
    this.http.get(`${environment.CRUD_BARTECH}pub/V1/${this.userId}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.bares = response; // Guardamos la respuesta (los bares) en la variable bares
        },
        error: (err) => {
          if (err.status === 401) {
            Swal.fire({
              title: 'No autorizado',
              text: 'El token ha expirado. Por favor inicia sesión de nuevo.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then(() => {
              window.location.href = '/login'; // Redireccionar al login
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al obtener los bares.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
  }
}
