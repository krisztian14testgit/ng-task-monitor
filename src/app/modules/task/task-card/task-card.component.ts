import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { MyValidator } from 'src/app/validators/my-validator';

import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { TimerState } from '../services/task-timer/task-timer.model';
import { Task, TaskStatus } from '../services/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnChanges, AfterViewInit {
  /** The current task reference which is given. */
  @Input() public task: Task = new Task();
  /** 
   * The switcher of the Task card. 
   * If it is true, not display the 'edit' button of the card.
   */
  @Input() public isReadonly = false;
  @Output() public readonly newTaskCreationFailed: EventEmitter<string> = new EventEmitter();
  
  /** The switcher of the card is editable or not. */
  public isEditable = false;
  /** The name of TaskStatus. */
  public statusLabel = '';
  public selectedTaskId = '';
  /** True: The card is selected, otherwise false. */
  public isSelected = false;
  /** 
   * Readonly prop: in minutes: 1439 => 24h * 60min -minValue(1)  => 23:59:00 
   * @readonly
   */
  public readonly TASK_MAX_MINUTES = Task.MAX_MINUTES -1;
  /** 
   * Stores the references of the formControls of the reactive form by the prop name.
   * It is helping construction to get current formControl form the Formgroup.
   */
  public readonly taskControls: {[prop: string]: FormControl };
  /** The FromGroup structure of the task. */
  public taskForm!: FormGroup;
  /**
   * Stores the initial value of the properties of task which are changeable.
   * This storer is used by the form reset.
   * 
   * @descripton property:
   * Values available by the Task property names.
   * * Task Properties: title, description, timeMinutes*/
  private readonly _defaultFormValues: {[property: string]: string | number} = {};

  constructor(private readonly taskService: TaskService,
              private readonly alertMessageService: AlertMessageService) { 
    this.taskControls = {
      title: new FormControl(),
      description: new FormControl(),
      timeMinutes: new FormControl()
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
    }
    
    if (this.task.id.length > 0) {
      // Task is defined, get TaskStatus key as string
      this.statusLabel = TaskStatus[this.task.status];
      this.taskForm = this.generateReactiveForm(this.task);
    }
  }

  /**
   * After the view initialization, taskControls get references from the taskForm by
   * the control name.
   */
  ngAfterViewInit(): void {
    if (this.taskForm) {
      this.taskControls['title'] = this.taskForm.get('title') as FormControl;
      this.taskControls['description'] = this.taskForm.get('description') as FormControl;
      this.taskControls['timeMinutes'] = this.taskForm.get('timeMinutes') as FormControl;
    }
  }

  /**
   * It runs when the user click on the card.
   * Display the 'edit' button.
   * @event Click
   */
  public onClickMatCard(): void {
    this.selectedTaskId = this.task.id;
    this.isSelected = true;
  }

  /**
   * This an event function.
   * It runs when the save button is clicked on.
   * 
   * Saving the task card.
   * If the task card is modified then the status of task will be Start again.
   * @event Click
   */
  public onSaveCard(): void {
    this.updateTaskStatus(TaskStatus.Start);
    this.saveTaskService();
  }

  /**
   * It runs when counterdown timer emits the status(started, finished, inprogress).
   * 
   * Updates the task status and timerDate properties after saving task instance.
   * @param timerTuple$ Stores the stateName and occuredDate of timer.
   * @event Change
   */
  public onTimerStatus(timerTuple$: [string, Date]): void {
    const [timerStateName, timerDate] = timerTuple$;
    this.updateTaskStatusBy(timerStateName);
    this.updateTaskTimerDateBy(timerStateName, timerDate);
    // saving modified task the reference
    this.saveTaskService();
  }

  /**
   * This is a click event function.
   * It runs when the user clicks on the 'edit'/'close' button on the card.
   * 
   * If the button is 'edit' then it will be 'colse' and after reverse.
   * * isEditable: true --> 'close'
   * * isEditable: false --> 'edit'
   * @event Click
   */
  public onEdit_colseCard(): void {
    this.isEditable = !this.isEditable;

    // new empty task card is closed without SAVING
    if (!this.isEditable && this.task.isNewTask()) {
      // notice the taskContainer component to remove the empty card.
      this.newTaskCreationFailed.next(this.task.id);
    }
    
    // it is closed, reset task values to initial.
    if (!this.isEditable) {
      this.taskForm.reset(this._defaultFormValues);
    }
  }

  /**
   * Saving/updating the task by the taskService if the taskForm is valid.
   */
  private saveTaskService(): void {
    this.taskForm.updateValueAndValidity();
    if (this.taskForm.valid) {
      const isNewTask = this.task.isNewTask();
      const errorText = 'Updating/saving has been failed, server error!';
      const successText = 'Saving has been success!';

      // updating values by the taksForm in the Task instance
      this.updateTaskValuesByForm();
      const serviceMethod = !isNewTask ? 'update': 'add';

      // updated task by the reference in this.task
      const saving$ = of(this.task);
      saving$.pipe(
        // ignore new request(insert, update) when the previous one is not completed!
        exhaustMap(task =>  this.taskService[serviceMethod](task))
      ).subscribe(savedTask => {
        // success branch
        this.task = savedTask;
        this.setDefaulFormValuesBy(savedTask);
        this.alertMessageService.sendMessage(successText);
      },
        () => this.alertMessageService.sendMessage(errorText),
        () => {
          // finally branch, Close the edit mode
          this.isEditable = false;
        });
    }
  }

  /** Updates the editable properties(title, description, timeMinutes) of Task instance. */
  private updateTaskValuesByForm(): void {
    this.task.title = this.taskForm.get('title')?.value;
    this.task.description = this.taskForm.get('description')?.value;
    this.task.timeMinutes = this.taskForm.get('timeMinutes')?.value;
  }

  /**
   * Updates the status number of the Task and statusLabel.
   * @param taskStatus 
   */
  private updateTaskStatus(taskStatus: TaskStatus): void {
    this.task.setStatus(taskStatus);
    this.statusLabel = TaskStatus[taskStatus];

    if (taskStatus === TaskStatus.Completed) {
      const timeMinutesControl = this.taskForm.get('timeMinutes');
      timeMinutesControl?.setValue(0);
      timeMinutesControl?.updateValueAndValidity();
    }
  }

   /**
   * Updates the status of the task by the given timerState.
   * 
   * @description
   * Task status will be changed by timer state:
   * * timer Started(1)     => task status: inProgress
   * * timer Interrupted(2) => task status: inProgress
   * * timer Finished(0)    => task status: Completed
   * @param timerStateName It can be: Started, Finished, Interrupted
   */
  private updateTaskStatusBy(timerStateName: string): void {
    this.isReadonly = false;
    // converts string to enum value
    const timerState = TimerState[timerStateName as keyof typeof TimerState];
    let taskStatusValue = TaskStatus.Completed;
    if (timerState > 0) {
      taskStatusValue = TaskStatus.Inprogress;
      // Inprogress task is not editable
      this.isReadonly = true;
    }
    this.updateTaskStatus(taskStatusValue);
  }

  /**
   * Updates the timerStartedDate or timerFinishedDate of task by the given timerState value.
   * 
   * If TimerState.Interrupted then timerFinishedDate will get that date when the interrupted event is occurred.
   * @param timerStateName It can be: Started, Finished, Inprogress.
   * @param timerDate That date of the timer when it is started, finished or interrupted!
   */
  private updateTaskTimerDateBy(timerStateName: string, timerDate: Date): void {
    if (timerStateName == TimerState[TimerState.Interrupted]) {
      timerStateName = TimerState[TimerState.Finished];
    }

    const propName = `timer${timerStateName}Date`;
    if (this.task.isHasOwnPoperty(propName)) {
      // Adjusts the timerStartedDate or timerFinishedDate with the system clock by the timer's state.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.task as any)[propName] = timerDate;
    }
  }

  /**
   * Preserves the intital values of the given Task.
   * @param task Reference of the Task.
   */
  private setDefaulFormValuesBy(task: Task): void {
    this._defaultFormValues['title'] = task.title;
    this._defaultFormValues['description'] = task.description;
    this._defaultFormValues['timeMinutes'] = task.initialTime;
  }

  /**
   * Returns the Reactive form from the given task instance.
   * @param task The instance of the given task.
   * @returns FormGroup
   */
  private generateReactiveForm(task: Task): FormGroup {
    // saving the intital values of the task
    this.setDefaulFormValuesBy(task);

    /* If initialTime contains origion adjusted time.
     * The initial time will be loaded in 'edit' mode of the task form
     * instead of the counterdown timer is inProgress.
     */
    const timeMinutes = task.timeMinutes === 0 && task.initialTime > 0 ? task.initialTime : task.timeMinutes;

    return new FormGroup({
      title: new FormControl(task.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.TaskName))
      ]),
      description: new FormControl(task.description, []),
      timeMinutes: new FormControl(timeMinutes, [
        Validators.required,
        Validators.max(this.TASK_MAX_MINUTES),
        Validators.min(0), //min value: 0 min
        Validators.pattern(MyValidator.Patterns.getRule(MyValidator.PatternRuleKeys.Number))
      ])
    });
  }
}
