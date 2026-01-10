import 'zone.js';  // Included with Angular CLI.
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import './app/typeExtensions/stringType';
import './app/typeExtensions/arrayType';

if (environment.production) {
  // enableProdMode is no longer needed in standalone applications
}

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
