
import { initWordList } from '../logic/wordListService.js';
import resetStatesFromDB from '../database/gameStates/stateReset.js';
import setRandom from '../database/thisDayWord.js';
//PROJEKT
import fs from 'fs';
import path from 'path';


// Get the current directory from the ES module URL
const lastRunFilePath = path.join('./', 'lastRun.json');
console.log(lastRunFilePath);

// Function to read last run date from file
const getLastRunTime = () => {
    if (fs.existsSync(lastRunFilePath)) {
        const data = fs.readFileSync(lastRunFilePath);
        return JSON.parse(data).lastRunTime ? new Date(JSON.parse(data).lastRunTime) : null;
    }
    return null; // If the file doesn't exist, return null
};

// Function to update last run time in file
const updateLastRunTime = (date) => {
    const data = { lastRunTime: date.toISOString() };
    fs.writeFileSync(lastRunFilePath, JSON.stringify(data));
};

const runDailyTask = async () => {
    try {
        console.log('Running daily reset task...');
        await setRandom();

        console.log('Daily reset completed.');
        await resetStatesFromDB();
    } catch (error) {
        console.error('Error during daily reset:', error);
    }
};

const startTasks = async () => {
    const now = new Date();
    const lastRun =  getLastRunTime();
    await initWordList();
    // If the daily tasks has not been run today
    if (!lastRun || now.getDate() !== lastRun.getDate()) {
        console.log('Daily task missed. Running task now...');
        await runDailyTask(); // Run the tasks

        // Update last run time in the file
        updateLastRunTime(now);
    } else {
        console.log('Daily task already completed today.');
    }
};
export default startTasks;