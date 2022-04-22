import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { MyValidator } from 'src/app/validators/my-validator';

import { Task, TaskStatus } from '../services/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnChanges, AfterViewInit {
  /** The current task reference which was given. */
  @Input() public task: Task = new Task();
  @Input() public isEditable = false;
  @Output() public readonly newTaskCreationFailed: EventEmitter<string> = new EventEmitter();
  
  /** The name of TaskStatus. */
  public statusLabel = '';
  public selectedTaskId = '';
  /** True: The card is selected, otherwise false. */
  public isSelected = false;
  /** 
   * Stores the references of the formControls of the reactive form.
   * It is helping construction to get current formControl form the Formgroup.
   */
  public taskControls: {[prop: string]: FormControl };
  /** The FromGroup structure of the task. */
  public taskForm!: FormGroup;
  /**
   * Stores the initial value of the properties of task which are changeable.
   * Values available by the Task property names.
   * * Task Properties: title, description, timeSeconds*/
  private _defaultFormValues: {[property: string]: string | number} = {};

  constructor(private readonly taskService: TaskService,
              private readonly alertMessageService: AlertMessageService) { 
    this.taskControls = {
      title: new FormControl(),
      description: new FormControl(),
      timeSeconds: new FormControl()
    };
  }

  /**
   * The given task is new (not saved) then card will be editable.
   * The task is defined (already exist) card mode will readonly.
   * Generating a reactiveForm by the given task.
   */
  ngOnChanges(): void {
    if (this.task.isNewTask()) {
      // new taks with empty form
      this.isEditable = true;
    } else if (this.task.id.length > 0) {
      // Task is defined, get TaskStatus key as string
      this.statusLabel = TaskStatus[this.task.status];
    }
    this.taskForm = this.generateReactiveForm(this.task);
  }

  /**
   * After the view initialization, taskControls get references from the taskForm by
   * the control name.
   */
  ngAfterViewInit(): void {
    this.taskControls['title'] = this.taskForm.get('title') as FormControl;
    this.taskControls['description'] = this.taskForm.get('description') as FormControl;
    this.taskControls['timeSeconds'] = this.taskForm.get('timeSeconds') as FormControl;
  }

  /**
   * This is an click event function.
   * It runs when the user click on the card.
   * Display the 'edit' button.
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
    this.taskForm.updateValueAndValidity();
    if (this.taskForm.valid) {
      const isNewTask = this.task.isNewTask();
      const errorText = 'Updating/saving has been failed, server error!';
      const successText = 'Saving has been success!';
      
      // updating values by the taksForm in the Task instance
      this.updateTaskValuesByForm();
      const serviceMethod = !isNewTask ? 'update': 'add';

      // it runs when updating/inserting task
      this.taskService[serviceMethod](this.task)
        .subscribe(savedTask => {
          // success branch
          this.task = savedTask;
          this.setDefaulFormValuesBy(savedTask);
          this.alertMessageService.sendMessage(successText);
        },
          _ => this.alertMessageService.sendMessage(errorText));
      
      // Close the edit mode
      this.isEditable = false;
    }
  }

  /**
   * This a click event function.
   * It runs when the user clicks on the 'edit'/'close' button on the card.
   * If the button is 'edit' then it will be 'colse' and after reverse.
   * * isEditable: true --> 'close'
   * * isEditabée: false --> 'edit'
   */
  public onEdit_colseCard(): void {
    this.isEditable = !this.isEditable;

    // new empty task card is closed without SAVING
    if (!this.isEditable && this.task.isNewTask()) {
      // notice the taskContainer component to remove the empty card.
      this.newTaskCreationFailed.next(this.task.id);
    }
    
    // it is closed, reset task values to initial
    if (!this.isEditable) {
      this.taskForm.reset(this._defaultFormValues);
    }
  }

  /** Updates the editable properties(title, description, timeSeconds) in Task class. */
  private updateTaskValuesByForm(): void {
    this.task.title = this.taskForm.get('title')?.value;
    this.task.description = this.taskForm.get('description')?.value;
    this.task.timeSeconds = this.taskForm.get('timeSeconds')?.value;
  }

  /**
   * Preserves the intital values of the given Task.
   * @param task Reference of the Task
   */
  private setDefaulFormValuesBy(task: Task): void {
    this._defaultFormValues['title'] = task.title;
    this._defaultFormValues['description'] = task.description;
    this._defaultFormValues['timeSeconds'] = task.timeSeconds;
  }

  /**
   * Returns the Reactive form from the given task instance.
   * @param task The instance of the given task.
   * @returns FormGroup
   */
  private generateReactiveForm(task: Task): FormGroup {
    // saving the intital values of the task
    this.setDefaulFormValuesBy(task);

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
        Validators.min(1), //min value: 1 min
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.Number))
      ])
    });
  }
}
