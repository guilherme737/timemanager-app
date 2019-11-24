import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioConsultaComponent } from './consulta/usuario-consulta.component';
import { UsuarioService } from './usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioFormularioComponent } from './formulario/usuario-formulario.component';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [
        UsuarioConsultaComponent,
        UsuarioFormularioComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsuarioRoutingModule,
        NgbModule,
        NgbPaginationModule
    ],
    providers: [
        UsuarioService
    ]
})
export class UsuarioModule { }
