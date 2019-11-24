import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioConsultaComponent } from './consulta/usuario-consulta.component';
import { HomeLayoutComponent } from 'src/app/layouts/home-layout/home-layout.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { UsuarioFormularioComponent } from './formulario/usuario-formulario.component';



const routes: Routes = [
    {
        path: 'usuario',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            /*{
                path: '',
                component: UsuarioConsultaComponent
            },*/
            {
                path: 'novo',
                component: UsuarioFormularioComponent
            },
            {
                path: ':id',
                component: UsuarioFormularioComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class UsuarioRoutingModule { }
