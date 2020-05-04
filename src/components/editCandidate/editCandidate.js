import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button } from '@material-ui/core';

class EditCandidate extends Component {

    componentDidMount = () => {
       this.findCandidate();
    }

    state = {
        name: '',
        email: '',
        incumbent: false,
        categories: this.props.reduxState.budget.pastBudget,
        budget: {

        }
    }
    // on page load loop through candidates from redux and set state with name, eamil, budget
    findCandidate = () =>{
        let candidates = this.props.reduxState.candidates.allCandidates
        for(let i = 0; i<candidates.length; i++){
            if (candidates[i].id === this.props.location.candidateId) {
                this.setState ({
                    ...this.state,
                    name: candidates[i].name,
                    email: candidates[i].email,
                    incumbent: candidates[i].incumbent,
                    budget: candidates[i].budget
                })
            }
        }
    }
    //on Save button click set newCandidate to all items of local state
    //then dispatch to SAGAs with that info
    //then bring back to adminElection page
    handleAdd = () => {
        let newCandidate = {
            name: this.state.name,
            email: this.state.email,
            incumbent: this.state.incumbent,
            budget: this.state.budget,
            id: this.props.location.candidateId,
            election_id: this.props.reduxState.elections.election.id
        }
        
        this.props.dispatch({ type: 'EDIT_CANDIDATE', payload: newCandidate })

        this.props.history.push('/adminElection')
    }

    //handles the change of name and email inputs
    handleChange = (event, typeOf) => {
        this.setState({
            [typeOf]: event.target.value
        })
    }

    //handles change of budget inputs
    handleBudgetChange = (event, id) => {
        console.log(event.target.value);
        console.log(id)
        this.setState({
            budget: {
                ...this.state.budget,
                [id]: event.target.value
            }
        })
        console.log(this.state);

    }
    //check box on DOM for incumbent 
    handleCheck = () => {
        this.setState({
            incumbent: !this.state.incumbent
        })
        console.log(this.state.incumbent);

    }
    //on button click bring back to adminElection page
    handleBack = () => {
        this.props.history.push('/adminElection');
    }

    render() {
        let name = this.props.reduxState.elections.election.name;
        let location = this.props.reduxState.elections.election.location;
        return (
            <div class="standard_container">
                <div class="left_just">
                    <Button color="primary" height="50px" width="100px"onClick={this.handleBack}>Back to {name} election</Button>
                </div>
                <h1>{name}</h1>
                <h3>{location}</h3>
                <br />
                <h2>Edit Candidate</h2>

                <label>Name: 
                <Input value={this.state.name} placeholder="First and Last Name" onChange={(event) => this.handleChange(event, 'name')} />
                </label>
                <br />

                <label>Email: 
                <Input value={this.state.email} placeholder="Email" onChange={(event) => this.handleChange(event, 'email')} />
                </label>

                <br />

                <label>Incumbent?
                <Input type="checkbox" value={this.state.incumbent} onChange={() => this.handleCheck()} />
                </label>

                <h2>Candidate's Proposed Budget</h2>

                {this.state.categories.map((category) => {
                    return (<div>
                        <label>{category.name}
                        <Input placeholder={category.name}  value={this.state.budget[category.id]} type='number' onChange={(event) => this.handleBudgetChange(event, category.id, category.name)} />
                        </label>

                        <br />
                    </div>)
                })}
                <br />
                <Button variant="outlined" color="primary" onClick={this.handleAdd} >Save</Button> <br /> <br />
                <Button variant="outlined" color="secondary" onClick={this.handleBack} >Cancel</Button>

            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(EditCandidate);