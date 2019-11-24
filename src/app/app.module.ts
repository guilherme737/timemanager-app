import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginModule } from './pages/login/login.module';
import { HomeModule } from './pages/home/home.module';
import { UsuarioModule } from './pages/usuario/usuario.module';
import { HeaderModule } from './componentes/header/header.module';
import { MenuModule } from './componentes/menu/menu.module';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { ConfiguracaoService, configServiceInitializerFactory } from './auth/configuracao.service';
import { PontoModule } from './pages/ponto/ponto.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeLayoutComponent,
        LoginLayoutComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(),
        AppRoutingModule,
        JwtModule,
        HeaderModule,
        MenuModule,
        LoginModule,
        HomeModule,
        UsuarioModule,
        PontoModule
    ],
    providers: [
        AuthGuard,
        ConfiguracaoService, {
            provide: APP_INITIALIZER,
            useFactory: configServiceInitializerFactory,
            deps: [ConfiguracaoService],
            multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
