import { Routes } from '@angular/router';
import { TaskComponent } from './task.component';

export const TASK_ROUTES: Routes = [
  { path: 'all', component: TaskComponent },
  { path: 'finished', component: TaskComponent }
];
