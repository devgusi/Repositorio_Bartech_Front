import { Component, OnInit } from '@angular/core';
import{usuario}from '../../../model/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  //public userName : string;
  //public password : string;
  //public name : string;
  //public surname :string;

  constructor(
    private _router:Router,
    
    
  ) { }

  ngOnInit(): void {
  }

  

}
