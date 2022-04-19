import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Task, TaskStatus } from '../../services/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit, OnChanges, AfterViewInit {
  /** The current task reference which was given. */
  @Input() public task: Task = new Task();
  @Input() public isEditable = false;
  
  /** The name of TaskStatus. */
  public statusLabel = '';
  public selectedTaskId = '';
  /** True: The card is selected, otherwise false. */
  public isSelected = false;
  public taskControls: {[prop: string]: FormControl};

  private _taskForm!: FormGroup;

  constructor() { 
    this.taskControls = {
      title: new FormControl(),
      description: new FormControl(),
      timeSeconds: new FormControl()
    };
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.task.id) {
      // get TaskStatus key as string
      this.statusLabel = TaskStatus[this.task.status];
    }
  }

  ngAfterViewInit(): void {
    if (this.isEditable) {
      this._taskForm = this.generateReactiveForm(this.task);
      this.taskControls['title'] = this._taskForm.get('title') as FormControl;
      this.taskControls['description'] = this._taskForm.get('description') as FormControl;
      this.taskControls['timeSeconds'] = this._taskForm.get('timeSeconds') as FormControl;
    }
  }

  public onClickMatCard(): void {
    this.selectedTaskId = this.task.id;
    this.isSelected = true;
  }

  private generateReactiveForm(task: Task): FormGroup {
    return new FormGroup({
      title: new FormControl(task.title, [
        Validators.required
      ]),
      description: new FormControl(task.description, [
        Validators.required
      ]),
      timeSeconds: new FormControl(task.timeSeconds, [
        Validators.required
      ])
    });
  }

}
