import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-listar-canciones',
  templateUrl: './listar-canciones.component.html',
  styleUrls: ['./listar-canciones.component.scss']
})
export class ListarCancionesComponent implements OnInit {

  qrData: string = 'https://www.ejemplo.com'; // URL o texto que deseas codificar

  constructor() { }

  ngOnInit(): void {
  
  }

}