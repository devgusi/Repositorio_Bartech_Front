import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'; // Opcional para manejo de alertas
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';


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
    
    this.token = localStorage.getItem('token') || '';
    this.userId = localStorage.getItem('userID') || '';
    
    if (!this.token) {
      Swal.fire({
        title: 'Sesión expirada',
        text: 'Inicia sesión para continuar.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = '/main';
      });
      return;
    }

    if (!this.userId) {
      this.getUserId();
    } else {
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

  getBares(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    
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

  eliminarBar(barId: string): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d9534f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${environment.CRUD_BARTECH}pub/V1/${barId}`, { headers })
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Eliminado!',
                text: 'El bar ha sido eliminado correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
              });

              // Actualizamos la lista de bares eliminando el bar de la lista local
              this.bares = this.bares.filter(bar => bar.id !== barId);
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un error al eliminar el bar. Por favor, inténtalo nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
      }
    });
  }
}
