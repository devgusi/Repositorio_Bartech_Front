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
  userID: string = ''; // ID del usuario almacenado
  usuarioID: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Llamar a la  función para obtener y almacenar el userId antes de realizar la petición POST
    this.getUserId();
    // Obtener el token y userID del localStorage
    this.token = localStorage.getItem('token') || '';
    this.usuarioID = localStorage.getItem('userID') || '';
    console.log('1. usuarioID' , this.usuarioID);
    console.log('2. token ', this.token);
    console.log('3. getusuarioId' , this.getUserId());

    // Verificar si el userID está disponible
    if (!this.userID) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró el userID, intenta iniciar sesión nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }


    // Llamar la función para obtener los bares del usuario actual
    this.getBares();
  }
  
  getUserId(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get(`${environment.CRUD_BARTECH}user/V1`, { headers })
      .subscribe({
        next: (response: any) => {
          // Obtener el username almacenado en el localStorage
          const storedUserName = localStorage.getItem('user');

          // Buscar el usuario en la lista de la respuesta
          const user = response.find((u: any) => u.userName === storedUserName);
          if (user) {
            // Almacenar el userID en la variable userId
            this.userID = user.id;
            console.log('4.userID ' ,storedUserName ,this.userID  );
            // Guardar también en localStorage para uso futuro si es necesario
            localStorage.setItem('usuarioID', this.userID);
            console.log('5. usuarioID ' ,this.userID  );

          } else {
            // Mostrar alerta si no se encuentra el usuario
            Swal.fire({
              title: 'Usuario no encontrado',
              text: 'No se encontró ningún usuario con ese nombre.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            title: 'Error al obtener usuarios',
            text: 'Hubo un error al intentar obtener los usuarios.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }

  // Función para obtener los bares del usuario a través de la petición GET
  getBares(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    // Realizamos la petición GET al endpoint con el userID
    this.http.get(`http://localhost:8080/pub/V1/${this.userID}`, { headers })
      .subscribe({
        next: (response: any) => {
          // Guardamos la respuesta (los bares) en la variable bares
          this.bares = response;
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al obtener los bares.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }
}
