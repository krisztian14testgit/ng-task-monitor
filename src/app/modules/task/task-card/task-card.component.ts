import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { of, EMPTY } from 'rxjs';
import { catchError, exhaustMap, finalize } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormValidator } from 'src/app/validators/my-validator';

import { AlertMessageService } from 'src/app/services/alert-message/alert-message.service';
import { TimerState } from '../services/task-timer/task-timer.model';
import { Task, TaskStatus } from '../services/task.model';
import { TaskService } from '../services/task.service';
import { CardHighlightDirective } from 'src/app/directives/card-highlight/card-highlight.directive';
import { InputBorderDirective } from 'src/app/directives/input-border/input-border.directive';
import { TaskTimerComponent } from '../task-timer/task-timer.component';

@Component({
    selector: 'app-task-card',
    templateUrl: './task-card.component.html',
    styleUrls: ['./task-card.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, CardHighlightDirective, InputBorderDirective, TaskTimerComponent]
})
export class TaskCardComponent {
  /** External input: the current task given by the parent. */
  public readonly taskInput = input<Task>(new Task(), { alias: 'task' });
  /** External input: whether the card is readonly (locked from editing). */
  public readonly isReadonlyInput = input(false, { alias: 'isReadonly' });
  /** This switcher is true then Task-timer 'start' button is active, otherwise it is disabled. */
  public readonly isTimePeriodToday = input(true);
  public readonly newTaskCreationFailed = output<string>();

  /** Local mutable task signal (synced from input, updated after save). */
  public readonly task = signal<Task>(new Task());
  /** Local mutable readonly state (synced from input, toggled by timer). */
  public readonly isReadonly = signal(false);
  /** The switcher of the card is editable or not. */
  public isEditable = false;
  /** The name of TaskStatus. */
  public statusLabel = '';
  public selectedTaskId = '';
  /** True: The card is selected, 'edit' button will appear. */
  public isSelected = false;
  /** 
   * Readonly prop: in minutes: 1439 => 24h * 60min -minValue(1)  => 23:59:00 
   * @readonly
   */
  public readonly TASK_MAX_MINUTES = Task.MAX_MINUTES -1;
  /** 
   * Stores the references of the formControls of the reactive form by the prop name.
   * It is helping construction to get current formControl by name.
   * It is used on edit form template.
   */
  public readonly taskControls: {[prop: string]: FormControl };
  /** The FromGroup structure of the task. */
  public taskForm!: FormGroup;
  /**
   * Stores the initial value of the properties of task which are changeable.
   * This storer is used by the form reset.
   */
  private readonly _defaultFormValues: {[property: string]: string | number} = {};

  private readonly taskService = inject(TaskService);
  private readonly alertMessageService = inject(AlertMessageService);

  constructor() { 
    this.taskControls = {
      title: new FormControl(),
      description: new FormControl(),
      timeMinutes: new FormControl()
    };

    // Sync input signals to local mutable signals and handle task change logic
    effect(() => {
      const t = this.taskInput();
      this.task.set(t);
      this.isReadonly.set(this.isReadonlyInput());

      if (t.isNewTask()) {
        this.isEditable = true;
      }

      if (t.id.length > 0) {
        this.statusLabel = TaskStatus[t.status];
        this.taskForm = this.generateReactiveForm(t);
        // Refresh form control references after form regeneration
        if (this.taskForm) {
          this.taskControls['title'] = this.taskForm.get('title') as FormControl;
          this.taskControls['description'] = this.taskForm.get('description') as FormControl;
          this.taskControls['timeMinutes'] = this.taskForm.get('timeMinutes') as FormControl;
        }
      }
    });
  }

  /**
   * It runs when the user click on the card.
   * Display the 'edit' button.
   * @event Click
   */
  public onClickMatCard(): void {
    this.selectedTaskId = this.task().id;
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
    if (!this.isEditable && this.task().isNewTask()) {
      // notice the taskContainer component to remove the empty card.
      this.newTaskCreationFailed.emit(this.task().id);
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
      // updating Task object by the taksForm
      this.updateTaskValuesByForm();
      const isNewTask = !this.taskService.isTaskAlreadyExist(this.task());
      const serviceMethod = isNewTask ? 'add': 'update';

      // updated task by the reference in this.task()
      const saving$ = of(this.task());
      saving$.pipe(
        // ignore new request(insert, update) when the previous one is not completed!
        exhaustMap(task => this.taskService[serviceMethod](task)),
        catchError(() => {
          this.alertMessageService.sendMessage('Updating/saving has been failed, server error!');
          return EMPTY;
        }),
        finalize(() => { this.isEditable = false; })
      ).subscribe(savedTask => {
        this.task.set(savedTask);
        this.savingInitialFormValues(savedTask);
        this.alertMessageService.sendMessage('Saving has been success!');
      });
    }
  }

  /** Updates the editable properties(title, description, timeMinutes) of Task instance. */
  private updateTaskValuesByForm(): void {
    const current = this.task();
    current.title = this.taskForm.get('title')?.value;
    current.description = this.taskForm.get('description')?.value;
    current.timeMinutes = this.taskForm.get('timeMinutes')?.value;
    if (this.taskForm.get('timeMinutes')?.value > 0) {
      current['_initialTime'] = this.taskForm.get('timeMinutes')?.value;
    }
    this.task.set(current);
  }

  /**
   * Updates the status number of the Task and statusLabel.
   * If the status is completed then timeMinutes will be zero.
   * @param taskStatus 
   */
  private updateTaskStatus(taskStatus: TaskStatus): void {
    const current = this.task();
    current.setStatus(taskStatus);
    this.statusLabel = TaskStatus[taskStatus];
    this.task.set(current);

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
    this.isReadonly.set(false);
    // converts string to enum value
    const timerState = TimerState[timerStateName as keyof typeof TimerState];
    let taskStatusValue = TaskStatus.Completed;
    
    if (timerState > 0) {
      taskStatusValue = TaskStatus.Inprogress;
      // Inprogress task is not editable
      this.isReadonly.set(true);
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
    const current = this.task();
    if (current.isHasOwnPoperty(propName)) {
      // Adjusts the timerStartedDate or timerFinishedDate with the system clock by the timer's state.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (current as any)[propName] = timerDate;
      this.task.set(current);
    }
  }

  /**
   * Preserves the intital values of the given Task.
   * @param task Reference of the Task.
   */
  private savingInitialFormValues(task: Task): void {
    this._defaultFormValues['title'] = task.title;
    this._defaultFormValues['description'] = task.description;
    this._defaultFormValues['timeMinutes'] = task.initialTime;
  }

  /** 
   * Returns the adjsuted timeMinutes of Task.
   * 
   * The Task initialTime contains origion adjusted time by the user.
   * The initial time will be loaded into timeMinutes in 'edit' mode.
   * Exclude the counterdown timer is inProgress.
   * @param task The instance of the given task.
   * @return number
   */
  private getTaskTimeMinutesByInitialTime(task: Task): number {
    return task.timeMinutes === 0 && task.initialTime > 0 ? task.initialTime : task.timeMinutes;
  }

  /**
   * Returns the Reactive form from the given task instance.
   * @param task The instance of the given task.
   * @returns FormGroup
   */
  private generateReactiveForm(task: Task): FormGroup {
    // saving the intital values of the task
    this.savingInitialFormValues(task);
    const timeMinutes = this.getTaskTimeMinutesByInitialTime(task);

    return new FormGroup({
      title: new FormControl(task.title, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(FormValidator.RegExpPatterns.getRule(FormValidator.RegExpKeys.TaskName))
      ]),
      description: new FormControl(task.description, []),
      timeMinutes: new FormControl(timeMinutes, [
        Validators.required,
        Validators.max(this.TASK_MAX_MINUTES),
        Validators.min(0), //min value: 0 min
        Validators.pattern(FormValidator.RegExpPatterns.getRule(FormValidator.RegExpKeys.Number))
      ])
    });
  }
}
