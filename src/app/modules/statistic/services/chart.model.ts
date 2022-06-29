/**
 * The supported types of datasets of the line-chart which represents.
 */
export enum LineChartReport {
    /** Counting the completed tasks in week. */
    CompletedTask,
    /** Amount of the spent time of the completed Tasks. */
    SpentTime
}

/**
 * The background-colors of the tasks statuses.
 */
export enum ChartBackGroundColor {
    /** Purple color of the Start task status. */
    Purple = 'rgb(125, 125, 200)',
    /** Orange color of the InProgress task status. */
    Orange = 'rgb(250, 150, 0)',
    /** Dark Green color of the Completed task status. */
    DarkGreen = 'rgb(0, 155, 0)'
}
