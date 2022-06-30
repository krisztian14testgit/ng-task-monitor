/// <reference lib="webworker" />

/**
 * This thread is responsible the calculate the rest millisecond of Task.
 *
 * Send back the difference from systemColck and task finishedDate.
 * If the task timer is over then difference will be zero, otherwise rest timer in Minutes.Seconds decimal number.
 */
addEventListener('message', (wEvent: MessageEvent) => {
  const retTimeList = [];
  // wEvent.data = [task1, task2, ..., n]
  if (wEvent && wEvent.data && wEvent.data.length > 0) {
    console.log('Web-worker get the task timer dates');
    const currentSystemDate = new Date();
    const tasks = wEvent.data;
    
    let restMillisec = 0;
    let restMinAndSec = 0;
    let restDate!: Date;
    
    if (tasks && tasks.length) {
      for (const currentTask of tasks) {
        restMillisec = 0;
        restMinAndSec = 0;
        if (currentTask.timerFinishedDate && currentTask.timerStartedDate) {
          restMillisec = currentTask.timerFinishedDate.getTime() - currentSystemDate.getTime();
          // if millisec greather than 0 then timer is not over.
          restMillisec = restMillisec > 0 ? restMillisec : 0;
          restDate = new Date(restMillisec);
          restMinAndSec = Number.parseFloat(`${restDate.getMinutes()}.${restDate.getSeconds()}`);
        }
    
        retTimeList.push(restMinAndSec);
      }
    }
  }
  // send back result to main thread
  postMessage(retTimeList);
});
