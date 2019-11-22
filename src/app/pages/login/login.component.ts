import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Usuario } from 'src/app/modelo/usuario';
import { UsuarioComponent } from '../usuario/usuario.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;

    usuario: Usuario;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.usuario = new Usuario();
        this.form = this.fb.group({
            login: [this.usuario.login, Validators.required],
            senha: [this.usuario.senha, Validators.required]
        });
    }

    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
            this.authService.login(this.form.get('login').value, this.form.get('senha').value);
        }
        this.formSubmitAttempt = true;
    }

}
