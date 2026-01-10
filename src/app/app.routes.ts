import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'location',
    loadComponent: () => import('./modules/change-location/change-location.component').then(m => m.ChangeLocationComponent)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/task/task.routes').then(m => m.TASK_ROUTES)
  },
  {
    path: 'statistic',
    loadChildren: () => import('./modules/statistic/statistic.routes').then(m => m.STATISTIC_ROUTES)
  },
  { path: '', redirectTo: '/tasks/all', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];
