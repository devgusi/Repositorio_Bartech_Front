import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/usuarios/registro/registro.component';
import { ModificarComponent } from './pages/usuarios/modificar/modificar.component';
import { RegistroCancionesComponent } from './pages/canciones/registro-canciones/registro-canciones.component';
import { ListarCancionesComponent } from './pages/canciones/listar-canciones/listar-canciones.component';
import { CommonModule } from '@angular/common';
import { RegistrarBarComponent } from './pages/bar/registrar-bar/registrar-bar.component';
import { ListarBarComponent } from './pages/bar/listar-bar/listar-bar.component';


import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  //usuarios
  { path: '', component: LoginComponent},
  { path: 'registarUsuario', component: RegistroComponent },
  { path: 'editarUsuario', component: ModificarComponent },
  //bares
  { path: 'listarBares', component: ListarBarComponent },
  { path: 'registarBar', component: RegistrarBarComponent},
  //canciones
  { path: 'listarCanciones', component: ListarCancionesComponent },
  { path: 'registarCancion', component: RegistroCancionesComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistroComponent,
    ModificarComponent,
    RegistroCancionesComponent,
    ListarCancionesComponent,
    RegistrarBarComponent,
    ListarBarComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
