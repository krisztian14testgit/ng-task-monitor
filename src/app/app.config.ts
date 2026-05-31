import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { AlertMessageService } from './services/alert-message/alert-message.service';
import { StyleManagerService } from './services/style-manager/style-manager.service';
import { SanitizeService } from './services/sanitize.service';
import { CountdownTimerService } from './services/countdown-timer/countdown-timer.service';
import { TaskService } from './modules/task/services/task.service';
import { TaskTimerService } from './modules/task/services/task-timer/task-timer.service';
import { LocationService } from './modules/change-location/services/location/location.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AlertMessageService,
    StyleManagerService,
    SanitizeService,
    CountdownTimerService,
    TaskService,
    TaskTimerService,
    LocationService
  ]
};
