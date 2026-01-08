import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  public readonly noApiLinkedText = `This app hasn't been linked with web API yet!`;
  constructor() {}

 
}
