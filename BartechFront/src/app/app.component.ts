import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BartechFront';
  qrData: string = 'https://www.ejemplo.com'; // Cambia esto por la URL o texto que quieras codificar
}
