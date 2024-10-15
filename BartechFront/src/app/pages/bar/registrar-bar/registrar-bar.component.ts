import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-registrar-bar',
  templateUrl: './registrar-bar.component.html',
  styleUrls: ['./registrar-bar.component.scss']
})
export class RegistrarBarComponent implements OnInit {
  registerForm!: FormGroup;
  userId: string = ''; // Variable para almacenar el ID del usuario actual
  token: string = '';  // Variable para almacenar el token

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombreEstablecimiento: ['', Validators.required],
      direccion: ['', Validators.required]
    });

    // Obtener el token del localStorage
    this.token = localStorage.getItem('token') || '';

    // Llamar a la función para obtener y almacenar el userId antes de realizar la petición POST
    this.getUserId();
  }

  // Función para obtener el userID del usuario actual y almacenarlo
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
            this.userId = user.id;
            console.log('USERID ' ,storedUserName ,this.userId  );
            // Guardar también en localStorage para uso futuro si es necesario
            localStorage.setItem('userID', this.userId);
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

  // Función para enviar el registro del establecimiento
  onSubmit(): void {
    if (this.registerForm.valid) {
      if (!this.userId) {
        // Mostrar alerta si aún no se ha obtenido el userID
        Swal.fire({
          title: 'Error',
          text: 'El ID del usuario no está disponible. Intenta de nuevo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }

      const formData = {
        userId: this.userId, // Utilizamos el userID obtenido
        address: this.registerForm.value.direccion,
        name: this.registerForm.value.nombreEstablecimiento
      };

      // Configuramos los encabezados, incluyendo el token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      console.log('USERID ' , this.userId  , 'TOKEN ', localStorage.getItem('token'));
      // Realizar la petición POST al endpoint con los headers
      this.http.post(`${environment.CRUD_BARTECH}pub/V1`, formData, { headers })
        .subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Establecimiento registrado con éxito',
              text: 'El establecimiento ha sido registrado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Redireccionar a otra página
              this.router.navigate(['/listarBares']);
            });
          },
          error: (err) => {
            if (err.status === 400 && err.error === 'Establecimiento ya existe') {
              Swal.fire({
                title: 'Error en el registro',
                text: 'El establecimiento ya existe. Intenta con otro nombre.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 2500
              });
            } else if (err.status === 401) {
              Swal.fire({
                title: 'No autorizado',
                text: 'El token no es válido o ha expirado.',
                icon: 'error',
                showConfirmButton: false,
                timer: 2500
              });
            } else {
              Swal.fire({
                title: 'Error al registrar el establecimiento',
                text: 'Ocurrió un error, intenta de nuevo.',
                icon: 'error',
                showConfirmButton: false,
                timer: 2500
              });
            }
          }
        });
    } else {
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos',
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      });
    }
  }
}
