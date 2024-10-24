import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-listar-canciones',
  templateUrl: './listar-canciones.component.html',
  styleUrls: ['./listar-canciones.component.scss']
})
export class ListarCancionesComponent implements OnInit {
  barId: string = ''; // Almacena el id del bar
  canciones: any[] = []; // Array para almacenar todas las canciones que vienen del endpoint
  cancionesPaginadas: any[] = []; // Array para almacenar las canciones que se muestran en la página actual
  paginaActual: number = 1; // Página actual
  cancionesPorPagina: number = 10; // Número de canciones por página
  Math: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Capturamos el id del bar desde la URL
    this.route.paramMap.subscribe(params => {
      this.barId = params.get('id') || ''; // Obtener el id del bar
      console.log('Bar ID:', this.barId);

      // Llamar al método para obtener las canciones
      this.obtenerCanciones();
    });
  }

  obtenerCanciones(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Realizamos la petición GET para obtener las canciones del bar
    this.http.get<any[]>(`http://localhost:8080/playlist/V1/${this.barId}`, { headers })
      .subscribe({
        next: (response) => {
          // Ordenamos las canciones de forma descendente por id
          this.canciones = response.sort((a, b) => b.id - a.id).map(cancion => {
            return { ...cancion, reproducida: false }; // Añadimos la propiedad 'reproducida' a cada canción
          });

          // Mostrar las canciones de la primera página
          this.paginarCanciones();
        },
        error: (err) => {
          console.error('Error al obtener las canciones:', err);
        }
      });
  }

  verEnYoutube(cancion: any): void {
    const query = encodeURIComponent(`${cancion.songName} ${cancion.genre} ${cancion.author}`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
    window.open(youtubeUrl, '_blank');

    // Marcar la canción como reproducida
    cancion.reproducida = true;
  }

  // Paginación
  paginarCanciones(): void {
    const inicio = (this.paginaActual - 1) * this.cancionesPorPagina;
    const fin = inicio + this.cancionesPorPagina;
    this.cancionesPaginadas = this.canciones.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
    this.paginarCanciones();
  }

  generarQRCode(): void {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    
    const qrData = `http://localhost:4200/registrarCancion/${this.barId}`;
    QRCode.toCanvas(canvas, qrData, function (error) {
      if (error) {
        console.error(error);
      } else {
        console.log('Código QR generado correctamente');
      }
    });
  }
}
