import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor(protected http: HttpClient, protected urlFuncionalidade?: string) {
    }

    getUrlBase() {
        return `${environment.serverUrl}`;
    }

    getUrlCompleta() {
        return `${this.getUrlBase()}${this.urlFuncionalidade}`;
    }

    inserir(dados) {
        return this.http.post<any>(`${this.getUrlCompleta()}`, dados);
    }

    alterar(dados, chave: number) {
        return this.http.post<any>(`${this.getUrlCompleta()}/${chave}`, dados).toPromise();
    }

    buscarDetalhe(chave: any): Observable<any> {
        let parametro: any = { chavePrimaria: chave };

        if (chave !== null && typeof chave === 'object') {
            parametro = this.toHttpParams(chave);
        }

        return this.http.get<Observable<any>>(`${this.getUrlCompleta()}/`, { params: parametro });
    }

    buscar(filtro: any) {
        const options = { params: this.toHttpParams(filtro) };

        return this.http.get(`${this.getUrlCompleta()}/`, options);
    }

    get<T>(url: string, filtro?: any, responseType?: string): Observable<T> {
        const options = { params: this.toHttpParams(filtro), responseType: (responseType ? responseType : 'json') as 'json' };

        return this.http.get<T>(`${this.getUrlCompleta()}${url}`, options);
    }

    post<T>(url: string, filtro?: any, responseType?: string): Observable<T> {
        const options = { responseType: (responseType ? responseType : 'json') as 'json' };

        return this.http.post<T>(`${this.getUrlCompleta()}${url}`, filtro, options);
    }


    toHttpParams(obj: Object): HttpParams {
        return this.toHttpParamsObjectRecursive(obj, new HttpParams());
    }

    private toHttpParamsObjectRecursive(obj: Object, params: HttpParams) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const val = obj[key];
                if (val !== null && val !== undefined) {

                    if (val !== null && typeof val === 'object') {
                        params = this.toHttpParamsObjectRecursive(val, params);

                    } else {
                        params = params.append(key, val.toString());
                    }
                }
            }
        }

        return params;
    }


}
