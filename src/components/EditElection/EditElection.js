import React, { Component } from 'react';
import '../App/App.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Input, Button } from '@material-ui/core';

class EditElection extends Component {
    state = {
        id: this.props.reduxState.elections.election.id,
        name: this.props.reduxState.elections.election.name,
        location: this.props.reduxState.elections.election.location,
        date: this.props.reduxState.elections.election.date,
        budgetArray: [],
        addCategoryToggle: false,
        newCategory: {
            name: '',
            amount: ''
        }
    }
    //on page load dispaly in DOM inputs the past budget from redux
    componentDidMount = () =>{
        this.setState({
            budgetArray: this.props.reduxState.budget.pastBudget
        })        
    }
    componentDidUpdate = (prevProps) =>{
        if (this.props.reduxState.budget.pastBudget !== prevProps.reduxState.budget.pastBudget) {
            this.setState({
                budgetArray: this.props.reduxState.budget.pastBudget
            })
        }
    }
    handleChange = (event, typeOf) =>{
        this.setState({
            [typeOf]: event.target.value
        })
    }
    //handles change of budget Inputs
    handleBudgetChange = (event, id) => {
        //create a copy of the array in state
        const newBudgetArray = this.state.budgetArray.slice();
        //loop through it and match the category id with the id coming from the Input
        for (let i = 0; i < newBudgetArray.length; i++) {
            if (newBudgetArray[i].id === id){
                newBudgetArray[i].past_allocation = event.target.value
            }
        }
        //set the budgetArray in the state to the new array 
        //with the updated allocation
        this.setState({
            budgetArray: newBudgetArray
        })
    }
    // on Submit button dispatch the change to the election to SAGAs
    //then bring user to adminElection
    submit = () =>{
        this.props.dispatch({type:'EDIT_ELECTION', payload: this.state});
        this.props.history.push('/adminElection');
    }
    //then bring user to adminElection
    cancel = () =>{
        this.props.history.push('/adminElection');
    }
    handleBack = () => {
        this.props.history.push('/adminElection');
    }
    addCategoryToggle = () => {
        this.setState({
            addCategoryToggle: !this.state.addCategoryToggle
        })
    }
    //handles change for inputs to set state for newCategory
    handleNewCategoryChange = (event, typeOf) => {
        this.setState({
            newCategory:{
                ...this.state.newCategory,
                [typeOf]: event.target.value
            }
        })
        console.log(this.state.newCategoryName);

    }
    //call to Sagas to add a new category
    addCategory = () => {
        console.log(this.state.newCategoryName);
        this.props.dispatch({
            type: 'ADD_NEW_CATEGORY',
            payload: {
                election_id: this.props.reduxState.elections.election.id,
                name: this.state.newCategory.name,
                amount: this.state.newCategory.amount,
                candidates: this.props.reduxState.candidates.allCandidates
            }
        })
        this.addCategoryToggle();

    }
    //call to Sagas to remove category
    removeCategory = (id) =>{
        console.log(id);
        this.props.dispatch({ 
            type: 'REMOVE_CATEGORY', 
            payload: { 
                election_id: this.props.reduxState.elections.election.id,
                budget_category_id: id, 
                candidates: this.props.reduxState.candidates.allCandidates
            }
        })
        
    }
    render = () => {
        let name = this.props.reduxState.elections.election.name;
        let location = this.props.reduxState.elections.election.location;
        
        let addCategory;
        if (this.state.addCategoryToggle) {
            addCategory = (
                <div>
                    <label>
                        <b>Category Name:</b>
                        <input onChange={(event) => this.handleNewCategoryChange(event, 'name')}></input>
                    </label>
                    <label>
                        <b>Amount of Budget:</b>
                        <input onChange={(event) => this.handleNewCategoryChange(event, 'amount')}></input>
                    </label>
                    <button type='button' onClick={this.addCategory}>Add</button>
                    <button onClick={this.addCategoryToggle}>Cancel</button>
                </div>
            );
        } else {
            addCategory = (
                <Button color="primary"  onClick={this.addCategoryToggle}>Add Category</Button>
            );
        }
        return (
            <div className="standard_container">
                <div class="left_just">
                    <Button color="primary" height="50px" width="100px" onClick={this.handleBack}>Back to {name} election</Button>
                </div>
                <h1>{name}</h1>
                <h3>{location}</h3>
                <br />

                <h2>Edit Election</h2>
          
                <label>Election Office: 
                    <Input value={this.state.name} onChange={(event) => this.handleChange(event, 'name')}/>
                </label>
                <br/>
                <label>Location: 
                    <Input value={this.state.location} onChange={(event) => this.handleChange(event, 'location')}/>
                </label>
                <br />
                <label>Date: 
                    <Input type='date' value={this.state.date} onChange={(event) => this.handleChange(event, 'date')}/>
                </label>
                <br />

                <h2>Edit Budget</h2>
                {this.state.budgetArray.map((budget) => {
                    return (
                    <div>
                        <label>{budget.name}</label>
                        <Input value={budget.past_allocation} type='number'
                            onChange={(event) => this.handleBudgetChange(event, budget.id)} 
                        />

                        <Button variant="outlined" color="secondary" size="small" onClick = {()=>this.removeCategory(budget.id)}>Remove Category</Button>

                        <br />
                    </div>)
                })}
                <br/>
                {addCategory}
                <br/>
                <br />
                <Button variant="outlined" color="primary" onClick={this.submit}>Submit</Button><br /><br />
                <Button variant="outlined" color="secondary" onClick={this.cancel}>Cancel</Button>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default withRouter(connect(mapStateToProps)(EditElection));