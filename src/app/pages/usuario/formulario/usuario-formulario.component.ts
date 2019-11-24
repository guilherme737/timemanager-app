import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-formulario',
    templateUrl: './usuario-formulario.component.html'
})
export class UsuarioFormularioComponent implements OnInit {

    form: FormGroup;

    permissoes: any = ['USUARIO', 'GERENTE', 'ADMIN'];

    constructor(private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private service: UsuarioService) { }

    ngOnInit() {

        this.form = this.fb.group({
            nome: [],
            horasDeTrabalhoPreferidasPorDia: [],
            permissao: [],
            login: [],
            senha: []
        });
    }

    irParaConsulta() {
        this.router.navigate(['/usuario']);
    }

    onSubmit() {
        this.service.inserir(this.form.value).subscribe(
            res => {
                this.toastr.success('Aviso', 'Registro inserido com sucesso.');
            },
            err => {
                this.toastr.error('Aviso', 'Erro ao inserir registro.');
            });
    }

}
