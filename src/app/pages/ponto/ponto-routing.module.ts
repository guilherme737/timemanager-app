import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from 'src/app/layouts/home-layout/home-layout.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { PontoFormularioComponent } from './formulario/ponto-formulario.component';
import { PontoConsultaComponent } from './consulta/ponto-consulta.component';


const routes: Routes = [
    {
        path: 'ponto',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: PontoConsultaComponent
            },
            {
                path: 'novo',
                component: PontoFormularioComponent
            },
            {
                path: ':id',
                component: PontoFormularioComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PontoRoutingModule { }
