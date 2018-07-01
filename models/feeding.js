const mongoose = require("mongoose");
const Scheduler = require('../scheduler');

var feedingSchema = mongoose.Schema(
    {
        location: String,
        amount: Number,
        food: String,
        foodType: String,
        numDucks: Number,
        dateTime: Number,
        isScheduled: Boolean
    }
)

const Feeding = mongoose.model('Feeding', feedingSchema);

const addFeeding = (req, res) => {
    const feeding = req.body;

    newFeeding = createNewFeeding(feeding, false);
    saveFeeding(newFeeding, function (err, savedObj) {
        if (err) {
            console.log(`Error at addFeeding: ${err}`);
            res.send(
                500, JSON.stringify({
                    type: 1,
                    msg: 'Error saving new feeding entry to database'
                }));
            return;
        }
        console.log("New feeding added successfully");

        if (feeding.isScheduled === 'true') {
            feeding.isScheduled = false;
            let scheduler = new Scheduler()
            scheduler.schedule(savedObj._id, savedObj.dateTime, function () {
                newFeeding = createNewFeeding(feeding, false);
                newFeeding.isScheduled = false;
                newFeeding.dateTime = new Date();
                saveFeeding(newFeeding, () => { })
            })
        }

        res.status(200).send('Feeding added successfully!');
    })

}

const createNewFeeding = (feeding, copy) => {
    let date = copy ? new Date(feeding.dateTime) : Date.parse(feeding.dateTime);

    const newFeeding =
        new Feeding({
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

const saveFeeding = (feeding, callback) => {
    feeding.save((err) => {
        callback(err, feeding);
    });
}

const getFeedings = (req, res) => {
    Feeding.find().exec(function (err, feedings) {
        if (err) return console.error(err);
        res.send(feedings);
    })
}

const setScheduled = (req, res) => {
    let id = req.body.id
    let isScheduled = req.body.isScheduled
    Feeding.findOne()
        .where('_id')
        .equals(id)
        .exec(function (err, feeding) {
            if (err) {
                res.send(
                    500, JSON.stringify({
                        type: 1,
                        msg: `Error finding feeding with id ${id}`
                    }));
                return;
            }
            else {
                let scheduler = new Scheduler()
                feeding.isScheduled = isScheduled;

                if (isScheduled === 'true') {
                    feeding.save((err) => { if (err) console.log('Error: ', err) });
                    scheduler.schedule(id, feeding.dateTime, function () {
                        let scheduledFeeding = createNewFeeding(feeding, true);
                        scheduledFeeding.isScheduled = false;
                        scheduledFeeding.dateTime = new Date();
                        console.log('repeated action for id', id)
                        saveFeeding(scheduledFeeding, (err, feeding) => { if (err) console.log(err) })
                    })
                    res.status(200).send('Feeding scheduled successfully!');
                } else {
                    feeding.save((err) => { if (err) console.log('Error: ', err) });
                    scheduler.unschedule(id);
                    res.status(200).send('Feeding unscheduled successfully!');
                }
            }
        });
}



module.exports =
    {
        Feeding,
        addFeeding,
        getFeedings,
        setScheduled,
        saveFeeding
    };
