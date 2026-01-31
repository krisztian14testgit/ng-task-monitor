import {Task, TaskStatus} from '../../modules/task/services/task.model';

/** Contains faked task items for testing case to Task service */
export class FakedTask {
    public static list: Task[] = [
        new Task('faked-task-45', 'fakedTask-45', 'This is faked Task45', 1.0),
        new Task('faked-task-20', 'fakedTask-20', 'During process', 2.2)
    ];

    /**
     * Generates new task if the task prop is not passed.
     * Adds new task and sets the id of taask if the task prop is passed.
     * Returns the new Task instance
     * @param task the instance of the Task.
     * @param status the TaskStatus of the task.
     * @param createdDate Task date when it is created. You can set: "Year-month-day HH:mm:ss"
     * @returns Task
     */
    public static addNewTask(task?: Task, status?: TaskStatus, createdDate?: string): Task {
        // generate id: 0-99
        const genId = Math.floor(Math.random() * 100);
        let retTask: Task;
        if (!task) {
            retTask = new Task(`faked-task-${genId}`, `fakedTask-${genId}`, 'new gen task', 1.0);
        } else {
            // Set up the id of the new Task instance
            retTask = task;
            retTask['_id'] = `faked-task-${genId}`;
        }

        if (status) { retTask['_status'] = status; }
        if (createdDate) { retTask['_createdDate'] = new Date(createdDate); }
        FakedTask.list.push(retTask);

        return retTask;
    }

    /**
     * Returns the last Task instance from the array.
     * @Note
     * It removes the last Task from the array.
     * @returns Task
     */
    public static getLatestNewTask(): Task {
        return FakedTask.list.pop() as Task;
    }
}
