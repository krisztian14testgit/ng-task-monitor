import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AlertWindowComponent } from './components/alert-window/alert-window.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, AlertWindowComponent]
})
export class AppComponent {
  public readonly noApiLinkedText = `This app hasn't been linked with web API yet!`;
  constructor() {}

 
}
