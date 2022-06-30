import { Task, TaskStatus } from "./task.model";

describe('Task class', () => {
    let task: Task;
    
    beforeAll(() => {
        task = new Task();
    });

    it('should create task instance', () => {
        expect(task).toBeDefined();
        expect(task.id).toBe('');

        // adjust the formal params
        const taskValues = ['389264-fake-faked-task1', 'Test task', 'Description here', 10];
        const taskPropNames = ['id', 'title', 'description', 'timeMinutes'];
        task = new Task('389264-fake-faked-task1', 'Test task', 'Description here', 10);
        for (let i = 0; i < taskPropNames.length; i++) {
            expect((task as any)[taskPropNames[i]]).toBe(taskValues[i]);
        }
    });

    it('should check readonly getter properties', () => {
        let propValue: string | number = task.id;
        expect(propValue).toBe(task.id);

        propValue = task.createdDate;
        expect(propValue).toBe(task.createdDate);

        propValue = task.status;
        expect(propValue).toBe(task.status);
    });

    it('should inspect the task is inProgress', () => {
        // initial values is start
        expect(task.status).toBe(TaskStatus.Start);
        expect(task.isInProgress()).toBeFalse();

        task.timeMinutes = 10;
        task.setStatus(TaskStatus.Inprogress);
        expect(task.isInProgress()).toBeTrue();

        task.setStatus(TaskStatus.Completed);
        expect(task.isInProgress()).toBeFalse();
    });

    it('should inspect the task is completed', () => {
        task.timeMinutes = 10;
        task.setStatus(TaskStatus.Inprogress);
        expect(task.isCompleted()).toBeFalse();

        task.setStatus(TaskStatus.Completed);
        expect(task.isCompleted()).toBeFalse();

        // only true if timeMinutes will be zero
        task.timeMinutes = 0;
        expect(task.isCompleted()).toBeTrue();
    });

    it('should inspect the task is new', () => {
        // The task.id does not contains the 'new' keyword.
        expect(task.isNewTask()).toBeFalse();
        
        const newTask = new Task('new-taskGUID');
        expect(newTask.isNewTask()).toBeTrue();
    });

    it('should check the task is created today or later', () => {
        // created today
        expect(task.isCreatedToday()).toBeTrue();

        const today = new Date();
        const left24hours = 24 * 60 * 60 * 1000; 
        const yesterday = new Date();
        yesterday.setTime(today.getTime() - left24hours);
        
        // created yesterday
        const oldTask = new Task('old-taskGUID', 'Old task');
        oldTask['_createdDate'] = yesterday;
        expect(oldTask.isCreatedToday()).toBeFalse();
    });

    it('should check to have own property or not', () => {
        let propertyName = 'title';
        expect(task.isHasOwnPoperty(propertyName)).toBeTrue();

        propertyName = '_id';
        expect(task.isHasOwnPoperty(propertyName)).toBeTrue();

        propertyName = 'title2';
        expect(task.isHasOwnPoperty(propertyName)).toBeFalse();

        propertyName = 'asdf';
        expect(task.isHasOwnPoperty(propertyName)).toBeFalse();
    });
});
