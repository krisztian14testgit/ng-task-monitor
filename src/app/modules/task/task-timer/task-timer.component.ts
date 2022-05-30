import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { TaskTimer } from '../services/task.model';

@Component({
  selector: 'app-task-timer',
  templateUrl: './task-timer.component.html',
  styleUrls: ['./task-timer.component.css']
})
export class TaskTimerComponent implements OnInit, OnChanges {
  @Input() public timerInMinutes = 0;
  public timerInMillisec = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.timerInMinutes > 0) {
      this.timerInMillisec = TaskTimer.convertsToMilliSec(this.timerInMinutes);
    }
  }

}
