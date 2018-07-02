import React, { Component } from 'react';
import DuckStatDAL from '../duck-stat-dal';
import './feedlist.css'

export class FeedList extends Component {
    constructor(props) {
        super(props);
        this.duckStatDAL = new DuckStatDAL();
        this.state = {
            feedingList: []
        }

        this.updateFeedList = this.updateFeedList.bind(this);
        this.handleScheduled = this.handleScheduled.bind(this);
        this.interval = null;

        this.updateFeedList(this)
    }

    componentWillMount() {
        const self = this;
        this.interval = setInterval(function () {
            self.updateFeedList(self)
        }, 150000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    // fetch data for the table
    updateFeedList(self) {
        const feedingPromise = self.duckStatDAL.getFeedingList()
        feedingPromise.end((err, res) => {
            if (err) window.console.log("Error fetching data: ", err);
            else {
                self.setState({
                    feedingList: res.body.sort((f1, f2) => {
                        var location1 = f1.location.toUpperCase();
                        var location2 = f2.location.toUpperCase();
                        if (location1 < location2) {
                            return -1;
                        }
                        if (location1 > location2) {
                            return 1;
                        }
                        return 0;
                    })
                });
            }
        });
    }

    handleScheduled(event) {
        const target = event.target;
        const value = target.checked;
        const id = target.name

        // TODO: modals
        const confirmed = window.confirm(`Are you sure you would like to ${value ? 'schedule' : 'unschedule'} this?`)
        if (confirmed) {
            this.duckStatDAL.scheduleFeeding(id, value)
                .end((err) => {
                    if (err) {
                        window.console.log(err);
                        return;
                    }

                    let list = this.state.feedingList
                    list.forEach(x => {
                        if (x._id === id) x.isScheduled = value
                    });

                    this.setState({
                        feedingList: list
                    })
                })
        }
    }

    render() {
        return (
            <div>
                <table className='duckStatTable'>
                    <thead>
                        <tr>
                            <th>Scheduled</th>
                            <th>Location</th>
                            <th>Amount of Food</th>
                            <th>Food Name</th>
                            <th>Food Type</th>
                            <th>Number of Ducks</th>
                            <th>Time of Feeding</th>
                        </tr>
                    </thead>

                    {this.state.feedingList.length > 0 &&
                        <tbody>
                            {
                                this.state.feedingList.map(feeding => {
                                    const date = new Date(feeding.dateTime);
                                    const dateString = date.toLocaleDateString() + " " + date.toLocaleTimeString();

                                    return (<tr key={feeding._id}>
                                        <td className='CheckboxTd'>
                                            <input type="checkbox" name={feeding._id} checked={feeding.isScheduled} onChange={this.handleScheduled} />
                                        </td>
                                        <td>{feeding.location}</td>
                                        <td>{feeding.amount}</td>
                                        <td>{feeding.food}</td>
                                        <td>{feeding.foodType}</td>
                                        <td>{feeding.numDucks}</td>
                                        <td>{dateString}</td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    }
                </table>
                {this.state.feedingList.length === 0 &&
                    <div>
                        <h3>No Data</h3>
                    </div>
                }
            </div>
        );
    }
}