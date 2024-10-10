import { Component } from '@angular/core';
import * as QRCode from 'qrcode';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listar-canciones',
  templateUrl: './listar-canciones.component.html',
  styleUrls: ['./listar-canciones.component.scss']
})
export class ListarCancionesComponent {

  // Método que se ejecuta al hacer clic en el botón
  generarQRCode() {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    
    // Cambia la URL o los datos que quieres codificar
    //const qrData = 'http://localhost:4200/registrarCancion';
    const qrData = environment.qrdata;
    
    // Genera el QR en el canvas
    QRCode.toCanvas(canvas, qrData, function (error) {
      if (error) {
        console.error(error);
      } else {
        console.log('Código QR generado correctamente');
      }
    });
  }
}
