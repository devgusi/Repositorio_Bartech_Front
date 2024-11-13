import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';
import { environment } from 'src/environments/environment.prod';

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
      this.limpiarCanciones();
      this.obtenerCanciones();
    });
  }

  obtenerCanciones(): void { 
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    this.http.get<any[]>(`${environment.CRUD_BARTECH}playlist/V1/${this.barId}`, { headers })
      .subscribe({
        next: (response) => {
          // Filtramos las canciones donde isPlayed es false
          this.canciones = response
            .filter(cancion => cancion.isPlayed === false)  // Filtra solo las canciones no reproducidas
            .sort((a, b) => b.id - a.id)  // Ordena las canciones por ID de mayor a menor
            .map(cancion => ({ ...cancion }));  // Se hace una copia de las canciones
  
          // Llamamos a la función para paginar las canciones después de aplicar el filtro
          this.paginarCanciones();
        },
        error: (err) => {
          console.error('Error al obtener las canciones:', err);
        }
      });
  }
  limpiarCanciones(): void {
    // Filtramos las canciones que no han sido reproducidas
    this.cancionesPaginadas = this.canciones.filter(c => !c.isPlayed);
  }
  

  verEnYoutube(cancion: any, index: number): void {
    const token = localStorage.getItem('token') || '';
    // Construye la URL de YouTube para buscar la canción
    const query = encodeURIComponent(`${cancion.songName} ${cancion.genre} ${cancion.author}`);
    const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
    window.open(youtubeUrl, '_blank');

    // Marcar la canción como reproducida y actualizar su estado visual
    //cancion.reproducida = true;
    //cancion.abierta = true;

    const fila = this.el.nativeElement.querySelector(`#fila-${index}`);
    if (fila) {
        fila.classList.add('bg-light');
    }

    // Enviar la solicitud PUT para actualizar el estado de la canción en el servidor
    const endpointUrl = `${environment.CRUD_BARTECH}playlist/V1/play/${cancion.id}`;
    const body = {
        id: cancion.id,
        isPlayed: "true"
    };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put(endpointUrl, body, { headers })
      .subscribe({
        next: () => {
          console.log('Estado de reproducción actualizado en el servidor');
          // Recargar la página para reflejar los cambios
          window.location.reload();
        },
        error: (err) => {
          console.error('Error al actualizar el estado de reproducción:', err);
        }
      });
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
    const qrData = `https://k24fpfim43xwqjftf4fza477vu.apigateway.us-ashburn-1.oci.customer-oci.com/registrarCancion/${this.barId}`;
    QRCode.toCanvas(canvas, qrData, error => {
      if (error) console.error(error);
      else console.log('Código QR generado correctamente');
    });
  }
  navegarAtras() {
    window.history.back(); // Redirige a la página anterior
  }
}
