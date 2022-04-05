import {Task} from '../../modules/task/services/task.model';

/** TODO: just for testing Task service */
export class FakedTask {
    public static list: Task[] = [
        new Task('faked-task-45', 'fakedTask-45', 'This is faked Task45', 0.0),
        new Task('faked-task-20', 'fakedTask-20', 'During process', 2.2)
    ];

    /**
     * Generates new task if the task prop is not passed.
     * Adds new task and sets the id of taask if the task prop is passed.
     * Returns the new Task instance
     * @param task the instance of the Task.
     * @returns Task
     */
    public static addNewTask(task?: Task): Task {
        // generate id: 0-99
        const genId = Math.random() * 100;
        let retTask: Task;
        if (!task) {
            retTask = new Task(`faked-task-${genId}`, `fakedTask-${genId}`, 'new gen task', 1.0);
            FakedTask.list.push(retTask);
        } else {
            // Set up the id of the new Task instance
            retTask = {...task} as Task;
            retTask['_id'] = `faked-task-${genId}`;
            FakedTask.list.push(task);
        }

        return retTask;
    }

    /**
     * Returns the last Task instance from the array.
     * Removes it from the array
     * @returns Task
     */
    public static getLatestNewTask(): Task {
        return FakedTask.list.pop() as Task;
    }
}