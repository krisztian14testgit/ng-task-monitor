import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { MyValidator } from 'src/app/validators/my-validator';

import { Task, TaskStatus } from '../../services/task.model';
import { TaskService } from '../../services/task.service';

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
  /** 
   * Stores the references of the formControls of the taks reactive form.
   * It is helping contruction to get current formControl form the Formgroup.
   */
  public taskControls: {[prop: string]: FormControl };
  /** The FromGroup structure of the task. */
  public taskForm!: FormGroup;

  constructor(private readonly taskService: TaskService,
              private readonly alertMessageService: AlertMessageService) { 
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
      this.taskForm = this.generateReactiveForm(this.task);
    }
  }

  ngAfterViewInit(): void {
    if (this.isEditable) {
      this.taskControls['title'] = this.taskForm.get('title') as FormControl;
      this.taskControls['description'] = this.taskForm.get('description') as FormControl;
      this.taskControls['timeSeconds'] = this.taskForm.get('timeSeconds') as FormControl;
    }
  }

  /**
   * This is an click event function.
   * It runs when the user click on the card.
   */
  public onClickMatCard(): void {
    this.selectedTaskId = this.task.id;
    this.isSelected = true;
  }

  /**
   * This an event function.
   * It runs when the save button is triggered.
   * Saving/updating the task by the taskService.
   */
  public onSaveCard(): void {
    const isNewTask = this.task.id.length > 0;
    const errorText = 'Updating/saving has been unsuccessful, server error!';
    // task instance contains the updated value by the taksForm by the references!
    this.taskForm.updateValueAndValidity();
    
    if (!isNewTask) {
      // update the existed task
      this.taskService.update(this.task)
      .subscribe(updatedTask => this.task = updatedTask,
        _ => this.alertMessageService.sendMessage(errorText));
    } else {
      // insert new task
      this.taskService.add(this.task)
      .subscribe(insertedTask => this.task = insertedTask,
        _ => this.alertMessageService.sendMessage(errorText));
    }
   
  }

  /**
   * Returns the Reactive form from the given task instance.
   * @param task The instance of the given task.
   * @returns FormGroup
   */
  private generateReactiveForm(task: Task): FormGroup {
    return new FormGroup({
      title: new FormControl(task.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.TaskName))
      ]),
      description: new FormControl(task.description, []),
      timeSeconds: new FormControl(task.timeSeconds, [
        Validators.required,
        Validators.max(24 * 60), // 24h => 24 * 60min
        Validators.min(1) //min value: 1 min
      ])
    });
  }
}
