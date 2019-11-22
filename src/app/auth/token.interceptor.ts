import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe, throwError } from 'rxjs';
import { filter, retryWhen, switchMap, take, delay } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    private static authService: AuthService = null;

    static init(authService: AuthService) {
        console.log(`Interceptador inicializado`);
        this.authService = authService;
    }

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (TokenInterceptor.authService === null || !TokenInterceptor.authService.interceptUrl(req)) {
            console.log(`evitando interceptação de token para ${req.urlWithParams}`);
            return next.handle(req);
        }

        console.log(`interceptando: ${req.urlWithParams}`);

        let retryCount = 0;

        return TokenInterceptor.authService.tokenDeAcesso$.pipe(
            filter(token => !!token),
            take(1),
            // delay(3000),
            switchMap(token => {
                console.log(`adicionando acesso token para ${req.urlWithParams}`);
                return next.handle(this.adicionarToken(req, token));
            }),
            // retry 1 time in case of 401 errors, in case the token expires between the expiration check and the http call
            retryWhen(pipe(switchMap(err => err instanceof HttpErrorResponse && (err as HttpErrorResponse).status === 401
                && retryCount++ < 2 ? of(err) : throwError(err)))),
        );
    }

    private adicionarToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

}
