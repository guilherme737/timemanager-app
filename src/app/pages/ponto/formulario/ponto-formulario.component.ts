import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PontoService } from '../ponto.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Usuario } from 'src/app/modelo/usuario';
import { Ponto } from 'src/app/modelo/ponto';

@Component({
    selector: 'app-ponto-formulario',
    templateUrl: './ponto-formulario.component.html'
})
export class PontoFormularioComponent implements OnInit {

    form: FormGroup;

    private codigoDoUsuario: number;

    constructor(private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private service: PontoService,
        private authService: AuthService) {

    }

    ngOnInit() {

        this.codigoDoUsuario = this.authService.usuarioLogado.id;

        this.form = this.fb.group({
            data: [],
            horasTrabalhadas: []
        });
    }

    irParaConsulta() {
        this.router.navigate(['/ponto']);
    }

    onSubmit() {

        if (this.form.valid) {

            const ponto = new Ponto();
            ponto.data = this.form.get('data').value;
            ponto.horasTrabalhadas = this.form.get('horasTrabalhadas').value;
            ponto.codigoDoUsuario = this.codigoDoUsuario;

            //this.form.get('codigoDoUsuario').setValue(this.usuarioLogado.id);

            this.service.inserir(ponto).subscribe(
                res => {
                    this.toastr.success('Registro inserido com sucesso.', 'Aviso');
                },
                err => {
                    this.toastr.error('Erro ao inserir registro.', 'Aviso');
                });
        }


    }

}
