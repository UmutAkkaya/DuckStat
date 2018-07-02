const request = require('superagent');

export default class DuckStatDAL {

    getFeedingList = () => {
        return request.get('/api/getFeedingList');
    }

    submitFeeding = (newFeeding) => {
        return request.post('/api/addFeeding')
            .send(newFeeding)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
    }

    scheduleFeeding = (id, isScheduled) => {
        return request.post('/api/setScheduled')
            .send({ id: id, isScheduled: isScheduled })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
    }
}