import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuarioConsultaComponent } from './pages/usuario/consulta/usuario-consulta.component';
import { Permissao } from './modelo/permissao.enum';
import { PontoConsultaComponent } from './pages/ponto/consulta/ponto-consulta.component';


const routes: Routes = [
    {
        path: '',
        component: HomeLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: [Permissao.ADMIN, Permissao.USUARIO, Permissao.GERENTE] },
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent,
                data: { roles: [Permissao.ADMIN, Permissao.USUARIO, Permissao.GERENTE] },
            },
            {
                path: 'usuario',
                component: UsuarioConsultaComponent,
                data: { roles: [Permissao.ADMIN, Permissao.USUARIO, Permissao.GERENTE] },
            },
            {
                path: 'ponto',
                component: PontoConsultaComponent,
                data: { roles: [Permissao.ADMIN, Permissao.USUARIO, Permissao.GERENTE] },
            }
        ]
    },
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
