import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StatisticComponent } from './statistic.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: 'daily', component: StatisticComponent },
      { path: 'weekly', component: StatisticComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticRoutingModule { }
