import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PontoService } from '../ponto.service';
import { Router } from '@angular/router';

interface Ponto {
    codigo?: number;
    data: string;
    horasTrabalhadas: number;
    dentroDoLimiteDeHorasPreferido?: boolean;
    nomeDoUsuario: string;
    usuario: {
        nome: string;
    }
}

@Component({
    selector: 'app-ponto-consulta',
    templateUrl: './ponto-consulta.component.html'
})
export class PontoConsultaComponent implements OnInit {

    pontos: Ponto[];

    form: FormGroup;

    pagina = 1;
    quantidadePorPagina = 4;
    tamanho = 0;


    get registros(): Ponto[] {
        return this.pontos
            .map((ponto, i) => ({ id: i + 1, ...ponto }))
            .slice((this.pagina - 1) * this.quantidadePorPagina, (this.pagina - 1) * this.quantidadePorPagina + this.quantidadePorPagina);
    }

    constructor(private fb: FormBuilder,
        private service: PontoService,
        private router: Router) { }

    ngOnInit() {
        this.service.buscar({}).subscribe(p => {
            this.pontos = p as Ponto[];
            this.tamanho = this.pontos.length;
        });

        this.form = this.fb.group({});
    }

    irParaNovo() {
        this.router.navigate(['/ponto/novo']);
    }

    onSubmit() {

    }

}
