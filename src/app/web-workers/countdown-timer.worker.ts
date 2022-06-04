/// <reference lib="webworker" />

/**
 * This thread is responsible the calculate the rest millisecond of Task
 * if its status is 'inProgress' => calculates the difference from timerFihisnhed and timerStarted dates.
 */

// wEvent.data = [task1, task2, ..., n]
addEventListener('message', (wEvent: MessageEvent) => {
  if (wEvent && wEvent.data.length > 0) { 
    console.log('Web-worker get the task timer dates');
    const tasks = wEvent.data;
    const retMillisecList = [];
    let minutesDiff = 0;

    if (tasks && tasks.length > 0) {
      for (const currentTask of tasks) {
        minutesDiff = 0;
        if (currentTask.timerFinishedDate && currentTask.timerStartedDate) {
            minutesDiff = currentTask.timerFinishedDate.getMinutes()
                            - currentTask.timerStartedDate.getMinutes();
            // not be negative number
            minutesDiff = minutesDiff > 0 ? minutesDiff : 0;
        }
    
        retMillisecList.push(minutesDiff);
      }
    }

    // send back result to main thread
    postMessage(retMillisecList);
  }
});
