import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Task } from '../modules/task/services/task.model';

/** Contains the pre-defined properties and methods for the different Chart.components. */
export interface IBaseChart {
    /** The chartjs types: line, pie, bar, ... */
    readonly currentChartType: ChartType;
    /** The chartjs options settings. */
    readonly currentChartOption: ChartConfiguration['options'];
    /** The chartjs Data structure. */
    currentChartDate: ChartData<'pie' | 'line', number[], string | string[]>;
    /** The chartjs plugins setting. */
    readonly currentChartPlugins: never[];
    /** Stores the actual chart titles which will be shown on the chart. */
    readonly _chartLabels?: string[];
    readonly _chartDataCallBack?: ((list: any[]) => number[])[];
    /** Stores the callback funtion references which calculate the completed Task or spent time data. */
    setCurrentChartDataBy(taskList: Task[]): void;
}
