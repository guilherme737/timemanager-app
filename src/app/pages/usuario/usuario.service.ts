import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfiguracaoService } from 'src/app/auth/configuracao.service';
import { Usuario } from 'src/app/modelo/usuario';
import { environment } from 'src/environments/environment';

@Injectable()
export class UsuarioService {

    URL_BASE = `${environment.serverUrl}`;

    signinUrl: string;

    constructor(private http: HttpClient, config: ConfiguracaoService) {
        console.log('init userservice');
        //super(Usuario, http, config.config.serverUrl + 'users', config.config.serverUrl + 'users/search');
        this.signinUrl = config.config.signinUrl;
    }


    buscarPorLogin(login: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.URL_BASE}usuario/buscar-por-login`, { params: new HttpParams().set('login', login) });
    }


}
