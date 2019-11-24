import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Permissao } from '../modelo/permissao.enum';
import { Usuario } from '../modelo/usuario';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log(`canActivate '${route.url}'`);
        return this.canActivateRoute(route, state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log(`canActivate child '${childRoute.url}'`);
        return this.canActivateRoute(childRoute, state);
    }

    private canActivateRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.usuarioLogado$.pipe(
            map(usuarioLogado => {
                const res = this.verificarRota(route, state, usuarioLogado);
                console.log(`can activate route '${state.url}' '${route.url}' ${res}`);
                return res;
            })
        );
    }

    private verificarRota(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, usuario: Usuario): boolean {
        if ((!route.data.roles && usuario)
            || (route.data.roles && !usuario)
            || (usuario && route.data.roles && !route.data.roles.includes(usuario.permissao)) || state.url === '/') {
            if (usuario) {
                /*
                if (usuario.permissao === Permissao.GERENTE) {
                    this.router.navigate(['/usuario']);
                } else {
                    this.router.navigate(['/home']);
                }
                */
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
            return false;
        }
        return true;
    }
}
