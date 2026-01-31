import { Routes } from '@angular/router';
import { StatisticComponent } from './statistic.component';

export const STATISTIC_ROUTES: Routes = [
  { path: 'daily', component: StatisticComponent },
  { path: 'weekly', component: StatisticComponent }
];
