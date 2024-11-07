import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-modificar-bar',
  templateUrl: './modificar-bar.component.html',
  styleUrls: ['./modificar-bar.component.scss']
})
export class ModificarBarComponent implements OnInit {
  barId: string = '';
  nombreEstablecimiento: string = '';  // Nombre del bar
  direccion: string = '';              // Dirección del bar

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private el: ElementRef,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.barId = params.get('id') || '';
      if (this.barId) {
        this.cargarDatosBar();
      }
    });
  }

  navegarAtras() {
    window.history.back(); // Redirige a la página anterior
  }

  cargarDatosBar(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>(`${environment.CRUD_BARTECH}pub/V1/${this.barId}`, { headers })
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            const barData = response[0];
            this.nombreEstablecimiento = barData.name;
            this.direccion = barData.address;
          }
        },
        error: (error) => {
          console.error('Error al cargar datos del bar:', error);
          Swal.fire('Error', 'No se pudo cargar los datos del establecimiento.', 'error');
        }
      });
  }


  enviarFormulario(event: Event): void {
    event.preventDefault(); // Evitar recarga de la página

    const nombreEstablecimiento = (this.el.nativeElement.querySelector('#nombreEstablecimiento') as HTMLInputElement).value;
    const direccion = (this.el.nativeElement.querySelector('#direccion') as HTMLInputElement).value;

    // Configuración de las cabeceras con el token si es necesario
    const token = localStorage.getItem('token') || '';
    console.log('token en editar BAR funcion de carga' , token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const data = {
      name: nombreEstablecimiento,
      address: direccion
    };

    this.http.put(`${environment.CRUD_BARTECH}pub/V1/${this.barId}`, data,{ headers })
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Bar actualizado',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/listarBares']);
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: error.message || 'Ocurrió un problema al actualizar el bar.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
logout() {
  // Limpiar los datos almacenados del usuario
  localStorage.removeItem('userID');
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirigir al usuario a la página de login
  this.router.navigate(['/main']);
}
}
