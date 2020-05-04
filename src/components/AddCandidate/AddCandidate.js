import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AddCandidate.css';
import { Input, Button } from '@material-ui/core';

class AddCandidate extends Component {
    state = {
        name: '',
        email: '',
        incumbent: false,
        categories: this.props.reduxState.budget.pastBudget,
        budget: {
        }
    }
    //on page load get the budget
    componentDidMount = () => {
        this.props.dispatch({
            type: 'FETCH_BUDGET',
            payload: this.props.reduxState.elections.election.id
        })
    }
    //sets state for Add Candidate button and then dispatch to Redux, then move to admin Election page
    handleAdd = () => {
        let newCandidate = {
            name: this.state.name,
            email: this.state.email,
            incumbent: this.state.incumbent,
            budget: this.state.budget,
            election_id: this.props.reduxState.elections.election.id
        }
        this.props.dispatch({ type: 'ADD_CANDIDATE', payload: newCandidate })
        this.props.history.push('/adminElection')
    }

    //handles the change of name and email inputs
    handleChange = (event, typeOf) => {
        this.setState({
            [typeOf]: event.target.value
        })
    }

    //Back button
    handleBack = () => {
        this.props.history.push('/adminElection');
    }

    //handles change of budget inputs
    handleBudgetChange = (event, id, typeOf) => {
        this.setState({
            budget: {
                ...this.state.budget,
                [typeOf]: {
                    ...this.state.budget[typeOf],
                    id: id,
                    amount: event.target.value
                }
            }
        })
    }

    //handles change of incumbent checkbox
    handleCheck = () => {
        this.setState({
            incumbent: !this.state.incumbent
        })
        console.log(this.state.incumbent);
    }

    render() {
        let name = this.props.reduxState.elections.election.name;
        let location = this.props.reduxState.elections.election.location;
        return (
            <div class="standard_container">
                <div className="left_just">
                    <Button  color="primary" height="50px" width="100px" onClick={this.handleBack}>Back to {name} election</Button>
                </div>
                
                <h1>{name}</h1>
                <h3>{location}</h3>
                <br />
                <h2>Add Candidate</h2>

                <label>Name:
                <Input value={this.state.name} onChange={(event) => this.handleChange(event, 'name')} />
                </label>

                <br />

                <label>Email:
                <Input value={this.state.email} onChange={(event) => this.handleChange(event, 'email')} />
                </label>
                <br />

                <label>Incumbent?
                <Input type="checkbox" value={this.state.incumbent} onChange={() => this.handleCheck()} />
                </label>

                <h2>Candidate's Proposed Budget</h2>

                {this.state.categories.map((category) => {
                    return (<div>
                        <label>{category.name}
                            <Input type='number' onChange={(event) => this.handleBudgetChange(event, category.id, category.name)} />
                        </label>
                        <br />
                    </div>)
                })}
                <br />
                <Button variant="outlined" color="primary" onClick={this.handleAdd} >Add Candidate</Button><br></br><br></br>
                <Button variant="outlined" color="secondary" onClick={this.handleBack} >Cancel</Button>

            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(AddCandidate);