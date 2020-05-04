import React, { Component } from 'react';
import '../App/App.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Election extends Component {
    state = {}

    // Handles election click, it is passed "this" and then sends the id to handleDispatch
    handleClick = (election) => {
        console.log(election.props.election.id)
        let election_id = election.props.election.id
        this.handleDispatch(election_id);
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.reduxState.budget.pastBudget !== prevProps.reduxState.budget.pastBudget) {
            this.props.history.push(`/Budget/${this.state.id}`);
        }
    }

    // Dispatches and fetches "budget", sets id in state, sets the current election
    handleDispatch = (id) => {

        this.props.dispatch({
            type: 'FETCH_BUDGET',
            payload: id
        })

        this.props.dispatch({
            type: 'SET_ELECTION',
            payload: this.props.election
        })

        this.setState({
            id: id
        })

    }

    render = () => {
        let election = this.props.election;
        let date = new Date(election.date);
        date = date.toUTCString()
        date = date.substring(0, 16);
        return (

            <div className="ElectionHolder">
                <div onClick={() => this.handleClick(this)} className="Election" style={{ marginBottom: '10px' }}>
                    <br />
                    <b>{election.name}</b>
                    <br />
                    <b>{election.location}</b>
                    <br />
                    {date}
                    
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapStateToProps)(Election));