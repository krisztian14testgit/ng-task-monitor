import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AlertWindowComponent } from './components/alert-window/alert-window.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuItemComponent,
    PageNotFoundComponent,
    AlertWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    /** Material modules */
    MatMenuModule,
    MatButtonModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
