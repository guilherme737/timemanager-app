import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../modelo/usuario';
import { map, catchError, switchMap, tap, skipWhile } from 'rxjs/operators';
import { HttpParams, HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { ConfiguracaoService as ConfiguracaoService } from './configuracao.service';
import { UsuarioService } from '../pages/usuario/usuario.service';
import { TokenInterceptor } from './token.interceptor';
import { Permissao as Permissao } from '../modelo/permissao.enum';

const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private jwtHelper: JwtHelperService;
    private tokenDeAcessoSubject: BehaviorSubject<string>;
    tokenDeAcesso$: Observable<string>;
    private usuarioLogadoSubject: BehaviorSubject<Usuario>;
    usuarioLogado$: Observable<Usuario>;
    private logoutSubject: Subject<string>;
    logout$: Observable<string>;
    private usuarioLoading = false;

    constructor(
        private http: HttpClient,
        private config: ConfiguracaoService,
        private router: Router,
        private usuarioService: UsuarioService,
    ) {
        console.log('init auth');
        this.jwtHelper = new JwtHelperService();
        TokenInterceptor.init(this);
        this.iniciarTokenDeAcessoPipe();
        this.iniciarUsuarioLogadoPipe();
        this.logoutSubject = new Subject<string>();
        this.logout$ = this.logoutSubject.asObservable();
    }

    private iniciarTokenDeAcessoPipe() {

        let tokenDeAcesso = this.getToken(accessTokenKey);
        tokenDeAcesso = tokenDeAcesso && !this.jwtHelper.isTokenExpired(tokenDeAcesso) ? tokenDeAcesso : null;

        this.tokenDeAcessoSubject = new BehaviorSubject(this.tokenDeAcesso);
        this.tokenDeAcesso$ = this.tokenDeAcessoSubject.asObservable().pipe(
            // filter(token => !!token),
            switchMap(token => {
                if (token && this.jwtHelper.isTokenExpired(token)) {
                    console.log('Token de acesso expirado');
                    // blocks loggedUser to emit until currrent user is loaded
                    this.usuarioLoading = true;
                    return this.carregarTokenDeAcessoUsandoRefreshToken();
                }
                console.log(`Token de acesso disponível ${!!token}`);
                return token ? of(token) : EMPTY;
            }),
        );
    }

    private iniciarUsuarioLogadoPipe() {
        this.usuarioLoading = true;
        this.usuarioLogadoSubject = new BehaviorSubject<Usuario>(null);
        this.usuarioLogado$ = this.usuarioLogadoSubject.asObservable().pipe(
            skipWhile(() => {
                // this stops loggedUser subject to emit when the current user is being loaded
                // it's mainly used inside auth guard, in order to make it waits for current user to be loaded before checking next url
                // console.log(`skip loggedUser ${this.userLoading}`);
                return this.usuarioLoading;
            }),
        );
        this.tokenDeAcessoSubject.asObservable().pipe(
            // blocks loggedUser to emit until currrent user is loaded
            tap(() => this.usuarioLoading = true),
            switchMap(token => this.obterUsuarioLogado(token)))
            .subscribe(usuario => {
                console.log(`Altera usuário logado ${usuario ? usuario.login : null}`);
                // permits loggedUser to emit new values
                this.usuarioLoading = false;
                this.usuarioLogadoSubject.next(usuario);
            });
    }

    get usuarioLogado(): Usuario {
        return this.usuarioLogadoSubject.value;
    }

    interceptUrl(req: HttpRequest<any>): boolean {
        return req.url.startsWith(this.config.config.serverUrl)
            && !req.url.startsWith(this.config.config.signinUrl)
            && !req.headers.get('Authorization');
    }

    login(login: string, senha: string): Promise<string> {
        return this.carregarTokenDeAcesso(true, null, login, senha).toPromise();
    }

    logout(msg: string): Promise<boolean> {
        console.log('logout');
        this.removerToken();
        this.logoutSubject.next(msg);
        return this.router.navigate(['/login']);
    }

    atualizarUsuarioLogadoEExecutarLogout(usuario: Usuario): boolean {
        console.log(`Atualizar usuario logado ${usuario.login}`);
        if (usuario.login !== this.usuarioLogadoSubject.value.login || usuario.permissao !== this.usuarioLogadoSubject.value.permissao) {
            this.logout('Login ou permissão do usuário atual foram alterados: executando logout ');
            return true;
        }
        this.tokenDeAcessoSubject.next(this.tokenDeAcessoSubject.value);
        return false;
    }

    temPermissao(permissao: string): Observable<boolean> {
        return this.usuarioLogado$.pipe(map(usuarioLogado => usuarioLogado && usuarioLogado.permissao === Permissao[permissao]));
    }

    private obterUsuarioLogado(accessToken): Observable<Usuario> {
        if (accessToken) {
            const data = this.jwtHelper.decodeToken(accessToken);
            // console.log(data);
            if (data) {
                return this.usuarioService.buscarPorLogin(data.user_name);
            }
        }
        return of(null);
    }

    private get tokenDeAcesso(): string {
        const token = this.getToken(accessTokenKey);
        return token && !this.jwtHelper.isTokenExpired(token) ? token : null;
    }

    private carregarTokenDeAcessoUsandoRefreshToken(): Observable<string> {
        const token = this.getToken(refreshTokenKey);
        if (!token || this.jwtHelper.isTokenExpired(token)) {
            console.log('Refresh token expirado: must logout');
            this.logout('Refresh token expirado');
            return EMPTY;
        }
        return this.carregarTokenDeAcesso(false, token);
    }

    private carregarTokenDeAcesso(recuperarTokenDeAcesso: boolean, refreshToken?: string, login?: string, senha?: string):
        Observable<string> {
        console.log(recuperarTokenDeAcesso ? 'login' : 'refresh_token');
        const params = recuperarTokenDeAcesso ?
            new HttpParams()
                .set('username', login)
                .set('password', senha)
                .set('grant_type', 'password') :
            new HttpParams()
                .set(refreshTokenKey, refreshToken)
                .set('grant_type', refreshTokenKey);
        return this.http.post<any>(this.config.config.loginUrl, params,
            {
                headers: new HttpHeaders().append('Authorization',
                    'Basic ' + btoa(`${this.config.config.clientId}:${this.config.config.clientSecret}`)),
            }
        ).pipe(
            // delay(2000),
            map(jwt => {
                console.log('Obtem Token');
                // console.log(jwt);
                return this.armazenarToken(jwt);
            }),
            catchError(error => {
                console.error(error);
                if (refreshToken) {
                    this.logout('Erro ao carregar token de acesso, executando logout.');
                }
                throw error;
            })
        );
    }

    private getToken(key: string): string {
        return localStorage.getItem(key);
    }

    private setToken(key: string, token: string) {
        localStorage.setItem(key, token);
    }

    private removerToken() {
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
        this.tokenDeAcessoSubject.next(null);
    }

    private armazenarToken(jwt: any): string {
        console.log(`armazenar token`);
        if (jwt && jwt[accessTokenKey]) {
            const accessToken = jwt[accessTokenKey];
            if (jwt[refreshTokenKey]) {
                this.setToken(refreshTokenKey, jwt[refreshTokenKey]);
            }
            this.setToken(accessTokenKey, accessToken);
            this.tokenDeAcessoSubject.next(accessToken);
            return accessToken;
        }
        console.log('token inválido');
        return null;
    }
}
