import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2'; // Opcional para alertas
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-registro-canciones',
  templateUrl: './registro-canciones.component.html',
  styleUrls: ['./registro-canciones.component.scss']
})
export class RegistroCancionesComponent implements OnInit {
  cancionForm: FormGroup;  // El formulario reactivo
  barId: string = '';      // El ID del bar capturado desde la URL


  // Modelo para los valores del formulario
  cancion = {
    genero: '',
    artista: '',
    nombresCancion: ''
  };

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private route: ActivatedRoute
  ) {
    // Inicializamos el formulario
    this.cancionForm = this.fb.group({
      genero: ['', Validators.required],
      artista: ['', Validators.required],
      nombresCancion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Capturamos el id del bar desde la URL
    this.route.paramMap.subscribe(params => {
      this.barId = params.get('id') || ''; // Obtener el id del bar
      console.log('Bar ID en registrar canción:', this.barId);
    });
  }

  // Función para enviar el formulario
  onSubmit(): void {
    if (this.cancionForm.valid) {
      // Creamos el objeto de la canción para enviarlo en el POST
      const nuevaCancion = {
        pubId: this.barId,  // El id del bar capturado
        songName: this.cancionForm.value.nombresCancion, // Nombre de la canción
        author: this.cancionForm.value.artista,          // Artista
        genre: this.cancionForm.value.genero,            // Género
        isPlayed: false                                  // Siempre false al registrar
      };

    // Configuración de las cabeceras con el token si es necesario
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Realizamos la petición POST al endpoint
    this.http.post('http://localhost:8080/playlist/V1/user/song', nuevaCancion, { headers })
      .subscribe({
        next: (response) => {
          // Mostrar alerta de éxito con Swal (opcional)
          Swal.fire({
            title: 'Canción solicitada con éxito',
            text: 'La canción ha sido registrada en la lista de reproducción, si desea agregar otra cancion por favor vuelva a llenar el formulario.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // Limpiar el formulario después de la solicitud exitosa
          this.cancionForm.reset();
        },
        error: (err) => {
          // Manejar el error
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al registrar la canción, intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }
}
}