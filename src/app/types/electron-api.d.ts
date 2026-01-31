import { LocationSetting } from '../modules/change-location/services/location/location-setting.model';
import { Task } from '../modules/task/services/task.model';

declare global {
  interface Window {
    electronAPI?: {
      ipcLocation: {
        save: (pathType: number, locSetting: LocationSetting) => void;
        getPaths: () => Promise<LocationSetting>;
      };
      ipcTaskList: {
        save: (taskList: Task[]) => void;
        getAll: () => Promise<{[prop: string]: string | number | Date}[]>;
      };
    };
  }
}

export {};
