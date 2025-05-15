
import { initWordList } from '../logic/wordListService.js';
import resetStatesFromDB from '../database/gameStates/stateReset.js';
import setRandom from '../database/wordleWord/chooseWord.js';
//PROJEKT
import fs from 'fs';
import path from 'path';


// Reads the last execution timestamp of the daily task from a JSON file. Its a global variable
const lastRunFilePath = path.join('./', 'src/config/lastRun.json');
console.log(lastRunFilePath);

/*
    This helper checks if the file exists at the configured path, parses its contents,
    and returns the stored date as a JavaScript Date object.If the file or
    `lastRunTime` entry is missing, it returns null.
*/
const getLastRunTime = () => {
    if (fs.existsSync(lastRunFilePath)) {
        const data = fs.readFileSync(lastRunFilePath);
        return JSON.parse(data).lastRunTime ? new Date(JSON.parse(data).lastRunTime) : null;
    }
    return null; 
};

/*
Writes the provided date to the JSON file as the new `lastRunTime`.

    The date is serialized to ISO format and saved, ensuring subsequent runs
    can detect if today's task has already executed.
*/
//PROJEKT
const updateLastRunTime = (date) => {
    const data = { lastRunTime: date.toISOString() };
    fs.writeFileSync(lastRunFilePath, JSON.stringify(data));
};
/*
Executes the daily reset operations for the game.

    This async function selects a new daily word and resets all user game states
    in the database. It logs progress and catches any errors.
 */
const runDailyTask = async () => {
    try {
        await setRandom();
        console.log('Running daily reset task...');
        await resetStatesFromDB();

        console.log('Daily reset completed.');
    } catch (error) {
        console.error('Error during daily reset:', error);
    }
};
/*
Initializes resources and ensures the daily task runs once per day.

On startup, this function loads the word list, checks the timestamp of the last
daily reset, and if it hasn’t run today, executes`runDailyTask` and updates
the timestamp file.
*/
const startTasks = async () => {
    const now = new Date();
    const lastRun =  getLastRunTime();
    await initWordList();
    
    // if the daily tasks has not been run today
    if (!lastRun || now.getDate() !== lastRun.getDate()) {
        console.log('Daily task missed. Running task now...');
        await runDailyTask(); // run the tasks

        // Update last run time in the file
        updateLastRunTime(now);
    } else {
        console.log('Daily task already completed today.');
    }
};

export default startTasks;