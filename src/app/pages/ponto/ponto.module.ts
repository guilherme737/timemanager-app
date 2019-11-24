import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PontoRoutingModule } from './ponto-routing.module';
import { PontoConsultaComponent } from './consulta/ponto-consulta.component';
import { PontoFormularioComponent } from './formulario/ponto-formulario.component';
import { PontoService } from './ponto.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPagination, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        PontoConsultaComponent,
        PontoFormularioComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PontoRoutingModule,
        NgbModule,
        NgbPaginationModule
    ],
    providers: [
        PontoService
    ]
})
export class PontoModule { }
