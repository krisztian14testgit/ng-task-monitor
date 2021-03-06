import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  /*{path: 'inprogress', component: undefined},
  {path: 'finished', component: undefined},*/
  // lazy loading part:
  {
    path: 'location',
    loadChildren: () => import('./modules/change-location/change-location.module').then(m => m.ChangeLocationModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./modules/task/task.module').then(module => module.TaskModule)
  },
  {
    path: 'statistic',
    loadChildren: () => import('./modules/statistic/statistic.module').then(module => module.StatisticModule)
  },
  // redirects to the task sub-side
  {path: '', redirectTo: '/tasks/all', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
