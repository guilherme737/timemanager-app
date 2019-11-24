import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoService } from 'src/app/auth/configuracao.service';
import { Usuario } from 'src/app/modelo/usuario';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/componentes/base/base.service';

@Injectable()
export class UsuarioService extends BaseService {

    URL_BASE = `${environment.serverUrl}`;

    constructor(http: HttpClient, config: ConfiguracaoService) {
        super(http, 'usuario');
        console.log('init userservice');

    }

    buscarPorLogin(login: string): Observable<Usuario> {
        return this.get<Usuario>(`/buscar-por-login`, { login: login });
    }

}
