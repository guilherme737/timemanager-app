import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario.component';
import { UsuarioService } from './usuario.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [UsuarioComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [UsuarioService]
})
export class UsuarioModule { }
