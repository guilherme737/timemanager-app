import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginModule } from './pages/login/login.module';
import { HeaderModule } from './componentes/header/header.module';
import { HomeModule } from './pages/home/home.module';
import { MenuModule } from './componentes/menu/menu.module';
import { UsuarioModule } from './pages/usuario/usuario.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ConfiguracaoService, configServiceInitializerFactory } from './auth/configuracao.service';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthGuard } from './auth/auth.guard';

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
        AppRoutingModule,
        JwtModule,
        HeaderModule,
        MenuModule,
        LoginModule,
        HomeModule,
        UsuarioModule
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
