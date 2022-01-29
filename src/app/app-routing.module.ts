import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /*{path: 'inprogress', component: undefined},
  {path: 'finished', component: undefined},*/
  // opening side:
  {path: '', redirectTo: '/', pathMatch: 'full'}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
