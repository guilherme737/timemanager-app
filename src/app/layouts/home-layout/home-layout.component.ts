import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home-layout',
    template: `
       
        <app-menu></app-menu>
        <div class="content-container">
            <div class="container-fluid">
                <router-outlet></router-outlet>
            </div>
        </div>
  `,
    styles: [
        `
        .content-container {
            padding-top: 20px;
            padding-left: 220px;
        }
    `]
})
export class HomeLayoutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
