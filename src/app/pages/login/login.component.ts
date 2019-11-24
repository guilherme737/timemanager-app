import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Usuario } from 'src/app/modelo/usuario';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;

    private loadingSubject: BehaviorSubject<boolean>;
    loading$: Observable<boolean>;

    usuario: Usuario;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loadingSubject = new BehaviorSubject<boolean>(false);
        this.loading$ = this.loadingSubject.asObservable();

    }

    ngOnInit() {
        this.usuario = new Usuario();
        this.form = this.fb.group({
            login: [this.usuario.login, Validators.required],
            senha: [this.usuario.senha, Validators.required]
        });
    }

    onSubmit() {

        this.loadingSubject.next(true);
        this.authService.login(this.form.get('login').value, this.form.get('senha').value)
            .then(
                () => {
                    this.loadingSubject.next(false);
                    this.router.navigate(['/home']);
                },
                error => {
                    console.log('Authentication failed.');
                    this.loadingSubject.next(false);
                });
    }

}
