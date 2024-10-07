import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/usuarios/registro/registro.component';
import { ListarCancionesComponent } from './pages/canciones/listar-canciones/listar-canciones.component';
import { RegistroCancionesComponent } from './pages/canciones/registro-canciones/registro-canciones.component';

// Importar el AuthGuard
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'main', component: LoginComponent },
  { path: 'registrarUsuario', component: RegistroComponent },
  // Aplicar el guardia de autenticación a las rutas protegidas
  { path: 'listarCanciones', component: ListarCancionesComponent, canActivate: [AuthGuard] },
  { path: 'registrarCancion', component: RegistroCancionesComponent, canActivate: [AuthGuard] },
  // Añade otras rutas protegidas que necesiten el token
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
