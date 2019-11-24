import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

    constructor(private router: Router, private authService: AuthService) { }

    navegarPara(menu: string) {
        this.router.navigate([`/${menu}`]);
    }

    logout() {
        this.authService.logout('Logout efetuado pelo usuario');
    }
}
