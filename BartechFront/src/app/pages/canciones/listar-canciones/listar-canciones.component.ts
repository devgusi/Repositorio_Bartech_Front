import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-listar-canciones',
  templateUrl: './listar-canciones.component.html',
  styleUrls: ['./listar-canciones.component.scss']
})
export class ListarCancionesComponent implements OnInit {
  barId: string = '';
  canciones: any[] = [];
  cancionesPaginadas: any[] = [];
  paginaActual: number = 1;
  cancionesPorPagina: number = 10;
  Math: any = Math; // Para usar Math.ceil en el HTML

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private el: ElementRef, // Inyectar ElementRef
    private renderer: Renderer2 // Inyectar Renderer2 para manipular el DOM
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.barId = params.get('id') || '';
      this.obtenerCanciones();
    });
  }

  obtenerCanciones(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>(`http://localhost:8080/playlist/V1/${this.barId}`, { headers })
      .subscribe({
        next: (response) => {
          this.canciones = response
            .sort((a, b) => b.id - a.id)
            .map(cancion => ({ ...cancion, reproducida: false }));
          this.paginarCanciones();
        },
        error: (err) => {
          console.error('Error al obtener las canciones:', err);
        }
      });
  }

  verEnYoutube(cancion: any, index: number): void {
    const query = encodeURIComponent(`${cancion.songName} ${cancion.genre} ${cancion.author}`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
    window.open(youtubeUrl, '_blank');

    // Cambiar el color de la fila con JavaScript
    const fila = this.el.nativeElement.querySelector(`#fila-${index}`);
    if (fila) {
      this.renderer.setStyle(fila, 'background-color', '#d9f7be'); // Color verde claro
      this.renderer.setStyle(fila, 'color', '#237804'); // Color de texto verde oscuro
    }

    // Cambiar el estado de la canción para evitar reproducir de nuevo
    cancion.reproducida = true;
  }

  paginarCanciones(): void {
    const inicio = (this.paginaActual - 1) * this.cancionesPorPagina;
    this.cancionesPaginadas = this.canciones.slice(inicio, inicio + this.cancionesPorPagina);
  }

  cambiarPagina(direccion: 'anterior' | 'siguiente'): void {
    if (direccion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
    } else if (direccion === 'siguiente' && this.paginaActual < Math.ceil(this.canciones.length / this.cancionesPorPagina)) {
      this.paginaActual++;
    }
    this.paginarCanciones();
  }

  generarQRCode(): void {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    const qrData = `http://localhost:4200/registrarCancion/${this.barId}`;
    QRCode.toCanvas(canvas, qrData, error => {
      if (error) console.error(error);
      else console.log('Código QR generado correctamente');
    });
  }
}
