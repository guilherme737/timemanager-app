import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';

interface Usuario {
    codigo?: number;
    nome: string;
    horas: number;
    login: string;
    permissao: string;
}

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario-consulta.component.html'
})
export class UsuarioConsultaComponent implements OnInit {

    usuarios: Usuario[];

    form: FormGroup;

    pagina = 1;
    quantidadePorPagina = 4;
    tamanho = 0;


    get getUsuarios(): Usuario[] {
        return this.usuarios
            .map((usuario, i) => ({ id: i + 1, ...usuario }))
            .slice((this.pagina - 1) * this.quantidadePorPagina, (this.pagina - 1) * this.quantidadePorPagina + this.quantidadePorPagina);
    }

    constructor(private fb: FormBuilder,
        private service: UsuarioService,
        private router: Router) { }

    ngOnInit() {
        this.service.buscar({}).subscribe(u => {
            this.usuarios = u as Usuario[];
            this.tamanho = this.usuarios.length;
        });

        this.form = this.fb.group({});
    }

    irParaNovo() {
        this.router.navigate(['/usuario/novo']);
    }

    onSubmit() {

    }

}
