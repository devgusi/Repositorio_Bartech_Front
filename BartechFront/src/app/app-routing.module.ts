import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/usuarios/registro/registro.component';
import { ListarCancionesComponent } from './pages/canciones/listar-canciones/listar-canciones.component';
import { RegistroCancionesComponent } from './pages/canciones/registro-canciones/registro-canciones.component';
import { ListarBarComponent } from './pages/bar/listar-bar/listar-bar.component';
import { ModificarBarComponent } from './pages/bar/modificar-bar/modificar-bar.component';
import { RegistrarBarComponent } from './pages/bar/registrar-bar/registrar-bar.component';
import { ModificarComponent } from './pages/usuarios/modificar/modificar.component';
// Importar el AuthGuard
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: 'main', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // Redirige al inicio de /main'
  { path: '**', redirectTo: '/main' }, // Manejo de rutas no encontradas, redirige a /main
  { path: 'registrarUsuario', component: RegistroComponent },
  // Aplicar el guardia de autenticación a las rutas protegidas
  { path: 'listarCanciones', component: ListarCancionesComponent, canActivate: [AuthGuard] },
  { path: 'registrarCancion/:id', component: RegistroCancionesComponent }, // Ruta ajustada

  { path: 'editarUsuario', component: ModificarComponent, canActivate: [AuthGuard]  },
  //bares
  { path: 'listarBares', component: ListarBarComponent , canActivate: [AuthGuard]},
  { path: 'listarCanciones/:id', component: ListarCancionesComponent, canActivate: [AuthGuard] },
  { path: 'registrarBar', component: RegistrarBarComponent, canActivate: [AuthGuard] },
  { path: 'editarBar', component: ModificarBarComponent , canActivate: [AuthGuard]},
  //canciones
 // Añade otras rutas protegidas que necesiten el token
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
