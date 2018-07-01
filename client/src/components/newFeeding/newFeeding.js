import React, { Component } from 'react';
import DuckStatDAL from '../duck-stat-dal';
import './newFeeding.css'
import imageSource from '../../images/ducks.jpg';


export class NewFeeding extends Component {
    constructor(props) {
        super(props);
        this.duckStatDAL = new DuckStatDAL();

        let date = new Date().toISOString();
        var emptyState = {
            location: "",
            amount: 0,
            food: "",
            foodType: "",
            numDucks: 0,
            dateTime: date.substring(0, date.length - 1), //for some reason there is a letter at the end of the ISO string
            isScheduled: false,
            disabled: true
        }

        this.state = emptyState;

        this.resetState = this.resetState.bind(this);
        this.updateFeedList = this.updateFeedList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
    }

    resetState() {
        let date = new Date().toISOString();
        var emptyState = {
            location: "",
            amount: 0,
            food: "",
            foodType: "",
            numDucks: 0,
            dateTime: date.substring(0, date.length - 1), //for some reason there is a letter at the end of the ISO string
            isScheduled: false,
            disabled: true
        }

        this.setState(emptyState);
    }

    updateFeedList() {
        this.duckStatDAL.getFeedingList()
            .then(res => this.setState({ feedingList: res }))
            .catch(err => {
                console.log('Error fetching the list: ', err)
                this.setState({ feedingList: [] })
            })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        this.setState({
            disabled: !this.isFormValid()
        });
    }

    isFormValid() {
        return this.state.food.trim() !== "" && this.state.foodType.trim() !== "" && this.state.location.trim() !== "" && this.state.dateTime !== "";
    }

    handleSubmit(event) {
        event.preventDefault();

        let feeding = {
            location: this.state.location,
            amount: this.state.amount,
            food: this.state.food,
            foodType: this.state.foodType,
            numDucks: this.state.numDucks,
            dateTime: this.state.dateTime,
            isScheduled: this.state.isScheduled
        }
        const self = this;

        this.duckStatDAL.submitFeeding(feeding)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                self.resetState()
            })
    }

    render() {
        let date = new Date().toISOString();
        let maxDate = date.substring(0, date.length - 1)

        return (
            <div className="Container">
                <h2>
                    <i> Have you fed a duck today... </i>
                </h2>
                <div className="newFeedingContainer">

                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Location:
                            <input type="text" name="location" value={this.state.location} onChange={this.handleChange} />
                        </label>
                        <label>
                            Amount of Food (g):
                            <input type="number" min="0" name="amount" value={this.state.amount} onChange={this.handleChange} />
                        </label>
                        <label>
                            Food Name:
                            <input type="text" name="food" value={this.state.food} onChange={this.handleChange} />
                        </label>
                        <label>
                            Food Type:
                            <input type="text" name="foodType" value={this.state.foodType} onChange={this.handleChange} />
                        </label>
                        <label>
                            Number of Ducks:
                            <input type="number" min="0" name="numDucks" value={this.state.numDucks} onChange={this.handleChange} />
                        </label>
                        <label>
                            Time of Feeding:
                            <input type="datetime-local" max={maxDate} name="dateTime" value={this.state.dateTime} onChange={this.handleChange} />
                        </label>

                        <div className="CheckboxContainer">
                            <label>
                                <span>Repeat every day</span>
                                <input type="checkbox" name="isScheduled" checked={this.state.isScheduled} onChange={this.handleChange} />
                            </label>
                        </div>
                        <input className="submit" type="submit" value="Submit" disabled={this.state.disabled} />
                    </form>
                </div>

                <div className="duckContainer" style={{ width: `${89 * Math.min(this.state.numDucks, 6)}px` }}>
                <img className='ducks' title='You helped these ducks!' alt="You helped these ducks!" src={imageSource} />
                </div>
            </div>
        );
    }


}