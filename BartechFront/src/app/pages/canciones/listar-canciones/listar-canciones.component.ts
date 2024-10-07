import { Component, OnInit } from '@angular/core';
import * as QRCode from 'qrcode'; // Importar la librería QRCode

@Component({
  selector: 'app-listar-canciones',
  templateUrl: './listar-canciones.component.html',
  styleUrls: ['./listar-canciones.component.scss']
})
export class ListarCancionesComponent implements OnInit {
  // qrData: string = 'http://localhost:4200/registrarCancion';
  qrData: string = 'https://www.youtube.com/watch?v=wunUvgf-IG4';
  

  constructor() { }

  ngOnInit(): void {
    this.generateQRCode();
  }

  generateQRCode(): void {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    QRCode.toCanvas(canvas, this.qrData, function (error: any) {
      if (error) {
        console.error(error);
      } else {
        console.log('QR code generated successfully!');
      }
    });
  }
}
