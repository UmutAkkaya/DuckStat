const cron = require('node-cron');

// TODO: Keep this in db and fetch when the app starts
const scheduledList = {}

class Scheduler {
    schedule(id, date, scheduledFunc) {
        if (scheduledList == null || scheduledList == undefined) {
            return;
        }

        if (scheduledList[id] != undefined) {
            console.log(`task with id ${id} already exists`)
            scheduledList[id].start();
        }

        if (date == undefined || date == null) {
            const task = cron.schedule('0 0 * * *', async function () {
                // schedule for 12 am
                await scheduledFunc();
            });
            scheduledList[id] = task;
        } else {
            var date = new Date(date);
            const task = cron.schedule(`${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} * * *`, async function () {
                await scheduledFunc();
            });
            scheduledList[id] = task;
        }
    }

    unschedule(id) {

        if (scheduledList == null || scheduledList == undefined || scheduledList[id] == undefined) {
            return false;
        }

        if (scheduledList[id] != undefined) {
            scheduledList[id].destroy();

            return true;
        }

        return false;
    }
}

module.exports = Scheduler