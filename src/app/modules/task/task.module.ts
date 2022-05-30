import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { TaskService } from './services/task.service';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskTimerComponent } from './task-timer/task-timer.component';

import { CardHighlightDirective } from 'src/app/directives/card-highlight/card-highlight.directive';
import { InputBorderDirective } from 'src/app/directives/input-border/input-border.directive';

@NgModule({
  declarations: [
    TaskComponent,
    TaskCardComponent,
    CardHighlightDirective,
    InputBorderDirective,
    TaskTimerComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    /**Materail directives */
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
