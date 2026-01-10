/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Task } from '../modules/task/services/task.model';

/** It contains the pre-defined properties and methods for the different Chart.components. */
export interface IBaseChart {
    /**
     * The chartjs types: line, pie, bar, ...
     * @memberof IBaseChart
     */
    readonly currentChartType: ChartType;
    /**
     * The chartjs options settings.
     * @memberof IBaseChart
     */
    readonly currentChartOptions: ChartConfiguration['options'];
    /**
     * The chartjs Data structure.
     * @memberof IBaseChart
     */
    currentChartData: ChartData<'pie' | 'line', number[], string | string[]>;
    /**
     * The chartjs plugins setting.
     * @memberof IBaseChart
     */
    readonly currentChartPlugins: never[];
    /** 
     * The property is optional. Default: undefined.
     * Stores the actual chart titles which will be shown on the chart.
     * 
     * @private privilege level
     * @memberof IBaseChart
     */
    readonly _chartLabels?: string[];
    /**
     * The property is optional. Default: undefined.
     * Stores the callback funtion references which calculate the completed Task or spent time data.
     * 
     * @private privilege level
     * @memberof IBaseChart
     */
    readonly _chartDataCallBack?: ((list: any[]) => number[])[];
    /**
     * Sets the chart data which display on the chart.
     * Settings the label and datasets of the line chart.
     * 
     * @param taskList The elements of the taskList.
     * @private privilege level
     * @memberof IBaseChart
     */
    _setCurrentChartDataBy(taskList: Task[]): void;
}
