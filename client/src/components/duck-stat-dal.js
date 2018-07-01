const request = require('superagent');

export default class DuckStatDAL {

    getFeedingList = () => {
        return request.get('/api/getFeedingList');
    }

    submitFeeding = (newFeeding) => {
        return request.post('/api/addFeeding')
            .send(newFeeding)
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Content-Type', 'application/x-www-form-urlencoded');
    }

    scheduleFeeding = (id, isScheduled) => {
        return request.post('/api/setScheduled')
            .send({ id: id, isScheduled: isScheduled })
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Content-Type', 'application/x-www-form-urlencoded');
    }
}