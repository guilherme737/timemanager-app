import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/componentes/base/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PontoService extends BaseService {

    constructor(http: HttpClient) {
        super(http, 'ponto');
    }
}
