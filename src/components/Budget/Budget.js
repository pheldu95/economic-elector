// The budget page will contain a user Input form to enter personal budget preferences. It will also display the current budget alongside the user Inputed budget. 
// The user can Input any number they want into a budget Input. But, they will have the current budget to reference so that they can come up with realistic numbers. 
// This data will be displayed in a bar chart showing the budget breakdown. Once the user has clicked the “Find My Candidate” Button, they will be brought to the Results View (3).


import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Budget.css'
import BudgetItem from '../BudgetItem/BudgetItem';
import { Input, Button, InputLabel } from '@material-ui/core';

class Budget extends Component {

    // Input value capture and temp cache before being sent to Reducer
    state = {
        budget: {
            lawEnforcement: '',
            parksRec: '',
            publicWorks: '',
            firstResponders: '',
            communityDev: '',
            administration: '',
            education: ''
        },

    }

    // Pushes to Results only when budget.results is updated ****-- Without reducer does not have data before Results component mount
    componentDidUpdate = (prevProps) => {
        if ((this.props.reduxState.budget.results !== prevProps.reduxState.budget.results)) {
            this.props.history.push(`/Results`);
        }
    }

    // Handles Button to go home
    handleBack = () => {
        console.log("going back....way back", this.props.history);
        this.props.history.push('/home');
    }

    // Handles input change and sets state
    handleBudgetChange = (event, typeOf) => {
        let tempTotal = parseFloat(parseFloat(this.state.budget.lawEnforcement) + parseFloat(this.state.budget.parksRec) + parseFloat(this.state.budget.publicWorks) + parseFloat(this.state.budget.firstResponders) + parseFloat(this.state.budget.communityDev) + parseFloat(this.state.budget.administration) + parseFloat(this.state.budget.education));
        this.setState({
            budget: {
                ...this.state.budget,
                [typeOf]: event.target.value,
                total: tempTotal
            }
        })
    }

    // Handles "Find Candidate Button click" ****-- calculates total user budget and instantiates budget.total for use in results
    findCandidate = () => {
        console.log('STATE IN BUDGET:', this.state.budget)
        let userBudget = this.state;
        console.log(userBudget)
        userBudget.budget.total = parseFloat(parseFloat(this.state.budget.lawEnforcement) + parseFloat(this.state.budget.parksRec) + parseFloat(this.state.budget.publicWorks) + parseFloat(this.state.budget.firstResponders) + parseFloat(this.state.budget.communityDev) + parseFloat(this.state.budget.administration) + parseFloat(this.state.budget.education));
        console.log(userBudget);
        this.props.dispatch({ type: 'FIND_CANDIDATE', payload: this.props.reduxState.elections.election.id });
        this.props.dispatch({ type: 'SET_USER_BUDGET', payload: userBudget });
        this.props.dispatch({ type: 'FETCH_CANDIDATES', payload: this.props.reduxState.elections.election.id });
        console.log("Finding Candidate Comparing to...", this.props.reduxState);
    }



    // render in Budget
    render() {
        let date = new Date(this.props.reduxState.elections.election.date);
        date = date.toUTCString()
        date = date.substring(0, 16);
        return (
            <div className="standard_container">
                <div class="left_just">
                    <Button color="primary" height="50px" width="100px" onClick={this.handleBack}>Back to Elections</Button>
                </div>
                <h1>{this.props.reduxState.elections.election.name}</h1>

                <h3>{this.props.reduxState.elections.election.location}</h3>

                <h3>{date}</h3>

                <br />

                <div className='budgetForm'>

                    <div class="left_just">

                        <h2>Create Your Budget Preferences</h2> 

                        <br />
                        
                        <div className="budgetInput">
                            <label> Parks and Recreation:</label>
                            <Input onChange={(event) => this.handleBudgetChange(event, 'parksRec')} />
                        </div>
                        

                        <br />
                        
                        <InputLabel> Law Enforcement:
                            <Input onChange={(event) => this.handleBudgetChange(event, 'lawEnforcement')} />
                        </InputLabel>

                        <br />
                       

                        <InputLabel> Education:
                            <Input onChange={(event) => this.handleBudgetChange(event, 'education')} />
                        </InputLabel>

                        <br />
                        

                        <InputLabel> First Responders:
                            <Input onChange={(event) => this.handleBudgetChange(event, 'firstResponders')} />
                        </InputLabel>

                        <br />
                       

                        <InputLabel> Public Works:
                            <Input onChange={(event) => this.handleBudgetChange(event, 'publicWorks')} />
                        </InputLabel>

                        <br />
                        

                        <InputLabel> Administration:
                            <Input onChange={(event) => this.handleBudgetChange(event, 'administration')} />
                        </InputLabel>

                        <br />
                        

                        <InputLabel> Community Development: 
                            <Input onChange={(event) => this.handleBudgetChange(event, 'communityDev')} />
                        </InputLabel>

                    </div>


                    <div className="right_just">
                        <h2><center>Current Budget</center></h2>
                 

                        {this.props.reduxState.budget.pastBudget.map((item) => (<p><BudgetItem item={item} /></p>))}
                    </div>

                </div>

                <Button style={{ marginBottom: '20px' }} variant="outlined" color="primary" onClick={this.findCandidate}>Find My Candidate</Button>

            </div>

        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(Budget);