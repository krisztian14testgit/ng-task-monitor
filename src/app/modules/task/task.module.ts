import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider'

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TaskService } from './services/task.service';
import { TaskCardComponent } from './task-card/task-card/task-card.component';

@NgModule({
  declarations: [
    TaskComponent,
    TaskCardComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule
  ],
  providers: [
    TaskService
  ]
})
export class TaskModule { }
