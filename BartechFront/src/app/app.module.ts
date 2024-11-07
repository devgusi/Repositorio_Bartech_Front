import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Agregar CUSTOM_ELEMENTS_SCHEMA
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
import { ModificarBarComponent } from './pages/bar/modificar-bar/modificar-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './auth/auth.guard'; // Importar el guardia


// Importar NgxQrcodeModule
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

const appRoutes: Routes = [
  //login
  { path: 'main', component: LoginComponent },
  //usuarios
  { path: 'registrarUsuario', component: RegistroComponent , canActivate: [AuthGuard] },
  { path: 'editarUsuario', component: ModificarComponent },
  //bares
  { path: 'listarBares', component: ListarBarComponent },
  { path: 'registrarBar', component: RegistrarBarComponent },
  { path: 'editarBar', component: ModificarBarComponent },
  //canciones
  { path: 'listarCanciones', component: ListarCancionesComponent, canActivate: [AuthGuard] },
  { path: 'registrarCancion', component: RegistroCancionesComponent },
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
    ListarBarComponent,
    ModificarBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule.forRoot(appRoutes),
    NgxQRCodeModule, // Agregar el módulo de QR
    ReactiveFormsModule, // Para formularios reactivos
    FormsModule, // <-- asegúrate de tener este import
    HttpClientModule // Para hacer las solicitudes HTTP
  ],
  providers: [AuthGuard], // Añadir el guardia de autenticación aquí
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agregar el esquema
})
export class AppModule {}
