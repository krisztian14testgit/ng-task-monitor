import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangeLocationComponent } from './change-location.component';

const routes: Routes = [
  {path: '', component: ChangeLocationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangeLocationRoutingModule { }
