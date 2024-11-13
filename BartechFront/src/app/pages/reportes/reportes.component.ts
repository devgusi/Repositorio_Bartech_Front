import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx'; // Importar la biblioteca xlsx
import { environment } from 'src/environments/environment';

interface GeneroConteo {
  genero: string;
  repeticiones: number;
  palabraMasRepetida: string; // Nueva propiedad para la palabra más repetida
  cancionMasRepetida: string; // Nueva propiedad para la canción más repetida

}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  generosConteo: GeneroConteo[] = []; // Almacenar datos de género, cantidad y palabra más repetida
  barId: string = ''; // ID del bar
  palabra :any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.barId = params.get('id') || '';
      this.obtenerConteoGeneros();
    });
  }

  // Función para exportar a Excel
  exportarTablaExcel(): void {
    // Convertir los datos a un formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(this.generosConteo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'GenerosConteo');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, 'ReporteGeneros.xlsx');
  }

  obtenerConteoGeneros(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    this.http.get<any[]>(`${environment.CRUD_BARTECH}playlist/V1/${this.barId}`, { headers })
      .subscribe(response => {
        const conteoGeneros: { [key: string]: { repeticiones: number, palabras: { [key: string]: number }, canciones: any[] } } = {};
  
        response.forEach(cancion => {
          const genero = cancion.genre;
          const nombreCancion = cancion.songName.toLowerCase().trim();
  
          if (!conteoGeneros[genero]) {
            conteoGeneros[genero] = { repeticiones: 0, palabras: {}, canciones: [] };
          }
  
          conteoGeneros[genero].repeticiones++;
          conteoGeneros[genero].canciones.push(cancion);
  
          const palabras = nombreCancion.split(/\s+/);
          palabras.forEach((palabra: string | number) => {
            conteoGeneros[genero].palabras[palabra] = (conteoGeneros[genero].palabras[palabra] || 0) + 1;
          });
        });
  
        this.generosConteo = Object.keys(conteoGeneros)
          .map(genero => {
            const palabras = conteoGeneros[genero].palabras;
            const palabraMasRepetida = Object.keys(palabras).reduce((a, b) => palabras[a] > palabras[b] ? a : b);
  
            const primeraCoincidencia = conteoGeneros[genero].canciones.find(cancion => 
              cancion.songName.toLowerCase().includes(palabraMasRepetida)
            )?.songName || '';
  
            return {
              genero: genero,
              repeticiones: conteoGeneros[genero].repeticiones,
              palabraMasRepetida: palabraMasRepetida,
              cancionMasRepetida: primeraCoincidencia
            };
          })
          .sort((a, b) => b.repeticiones - a.repeticiones);
      });
  }
  navegarAtras() {
    window.history.back(); // Redirige a la página anterior
  }

  
}
