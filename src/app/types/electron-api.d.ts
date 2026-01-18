import { LocationSetting } from '../modules/change-location/services/location/location-setting.model';

declare global {
  interface Window {
    electronAPI?: {
      ipcLocation: {
        save: (pathType: number, locSetting: LocationSetting) => void;
        getPaths: () => Promise<LocationSetting>;
      };
      ipcTaskList: {
        save: (taskList: any[]) => void;
        getAll: () => Promise<{[prop: string]: string | number | Date}[]>;
      };
    };
  }
}

export {};
