const mongoose = require("mongoose");

const feedingSchema = mongoose.Schema(
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

function saveFeeding(newFeeding) {
    return newFeeding.save();
}

function getFeedings() {
    return new Promise((resolve, reject) => {
        Feeding.find().exec(function (err, feedings) {
            if (err) reject(err);
            else resolve(feedings);
        })
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        Feeding.findOne()
            .where('_id')
            .equals(id)
            .exec(function (err, feeding) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(feeding)
                }
            });
    });
}



module.exports =
    {
        Feeding,
        getFeedings,
        getById,
        saveFeeding
    };
