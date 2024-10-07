import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicializa el formulario con validaciones simples
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
  
      // Realizar la petición POST al endpoint
      this.http.post(`${environment.CRUD_BARTECH}auth/V1/create`, formData)
        .subscribe({
          next: (response) => {
            // Mostrar respuesta de éxito con Swal
            Swal.fire({
              title: 'Usuario registrado con éxito',
              text: 'Por favor, inicie sesión',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Redireccionar a otra página
              this.router.navigate(['/main']);
            });
          },
          error: (err) => {
            if (err.status === 400 && err.error === 'Usuario ya existe') {
              // Mostrar alerta si el usuario ya existe
              Swal.fire({
                title: 'Error en el registro',
                text: 'El usuario ya existe. Intenta con otro nombre de usuario.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 2500
              });
            } else {
              // Mostrar alerta genérica de error
              Swal.fire({
                title: 'Error al registrar el usuario',
                text: 'Ocurrió un error, intenta de nuevo.',
                icon: 'error',
                showConfirmButton: false,
                timer: 2500
              });
            }
          }
        });
    } else {
      // Mostrar alerta si el formulario no es válido
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
