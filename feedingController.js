const FeedingRepository = require('./models/feeding.js');
const Scheduler = require('./scheduler');

async function addFeeding(req, res) {

    const feeding = req.body;
    newFeeding = await createNewFeeding(feeding, false);

    try {
        await FeedingRepository.saveFeeding(newFeeding);

        if (feeding.isScheduled) {
            // copy of the object is saved by the scheduler every day
            feeding.isScheduled = false;
            const scheduler = new Scheduler()
            scheduler.schedule(newFeeding._id, newFeeding.dateTime, async function () {
                newFeeding = createNewFeeding(feeding, false);
                newFeeding.isScheduled = false;
                newFeeding.dateTime = new Date();
                try {
                    await FeedingRepository.saveFeeding(newFeeding);
                } catch (err) {
                    console.log(err);
                }
            });
        }

        res.send(204, '');
    }
    catch (err) {
        console.log(err)
        res.send(
            500, JSON.stringify({
                type: 1,
                msg: 'Error saving new feeding entry to database',
                err: err
            }));
        return;
    }
}

function createNewFeeding(feeding, copy) {
    const date = copy ? new Date(feeding.dateTime) : Date.parse(feeding.dateTime);

    const newFeeding =
        new FeedingRepository.Feeding({
            location: feeding.location,
            amount: feeding.amount,
            food: feeding.food,
            foodType: feeding.foodType,
            numDucks: feeding.numDucks,
            dateTime: date,
            isScheduled: feeding.isScheduled
        });

    return newFeeding;
}

async function getFeedings(req, res) {
    try {
        const flist = await FeedingRepository.getFeedings();
        res.send(flist).status(200);
    }
    catch (err) {
        res.send(
            500, JSON.stringify({
                type: 1,
                msg: 'Error trying the fetch data',
                err: err
            }));
        return;
    }
}

async function setScheduled(req, res) {
    const id = req.body.id;
    const isScheduled = req.body.isScheduled;
    try {
        const feeding = await FeedingRepository.getById(id);

        const scheduler = new Scheduler();
        feeding.isScheduled = isScheduled;

        if (isScheduled) {
            await FeedingRepository.saveFeeding(feeding);
            scheduler.schedule(id, feeding.dateTime, async function () {
                const scheduledFeeding = createNewFeeding(feeding, true);
                scheduledFeeding.isScheduled = false;
                scheduledFeeding.dateTime = new Date();
                console.log('repeated action for id', id);
                try {
                    await FeedingRepository.saveFeeding(scheduledFeeding);
                } catch (err) {
                    console.log('Error trying to repeat the step: ', err);
                }
            });

            res.send(204, '');
        } else {
            await FeedingRepository.saveFeeding(feeding);
            scheduler.unschedule(id);

            res.send(204, '')
        }
    } catch (err) {
        res.send(
            500, JSON.stringify({
                type: 1,
                msg: 'Error trying the schedule',
                err: err
            }));
        return;
    }
}

module.exports = {
    addFeeding,
    getFeedings,
    setScheduled
}