import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './task.component';

const routes: Routes = [
  { path: '',
    children: [
      { path: 'inprogress', component: TaskComponent },
      { path: 'finished', component: TaskComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
