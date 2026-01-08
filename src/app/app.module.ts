import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AlertWindowComponent } from './components/alert-window/alert-window.component';
import { StyleThemeComponent } from './components/style-theme/style-theme.component';

import { AlertMessageService } from './services/alert-message/alert-message.service';
import { StyleManagerService } from './services/style-manager/style-manager.service';
import { SanitizeService } from './services/sanitize.service';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        MenuItemComponent,
        PageNotFoundComponent,
        AlertWindowComponent,
        StyleThemeComponent,
        SafeHtmlPipe
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        /** Material modules */
        MatMenuModule,
        MatButtonModule,
        MatGridListModule,
        MatRadioModule,
        MatIconModule], providers: [
        AlertMessageService,
        StyleManagerService,
        SanitizeService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
