import React, { Component } from 'react';
import '../App/App.css';
import { connect } from 'react-redux';
import { Button, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';

class AdminElection extends Component {

    // on button click bring user to add Add Candidate/Edit Candidate page
    addCandidate = () => {
        this.props.history.push('/addCandidate')
    }

    // bring user to editCandidate page with election ID passed as a prop
    editCandidate = (event, id) => {
        this.props.history.push({
            pathname: '/editCandidate',
            candidateId: id
        });
    }

    // removeCandidate deletes candidate from this election
    // call to sagas to make DELETE call to "candidates" table
    // must send with it the election ID
    removeCandidate = (event, id) => {
        let obj = {
            candidate: id,
            electionId: this.props.reduxState.elections.election.id
        }
        this.props.dispatch({
            type: 'DELETE_CANDIDATE_FROM_LIST',
            payload: obj
        }); 
    }
    //on button click move to editElection page
    editElection = () =>{
        this.props.history.push('/editElection');
    }
     //on button click move to adminHome page
    handleBack = () => {
        this.props.history.push('/adminHome');
    }
    //on button click send email to candidate email address via node mailer
    requestBudget = (candidate) =>{
        this.props.dispatch({ type: 'SEND_BUDGET_REQUEST', 
        payload: { candidate: candidate, election: this.props.reduxState.elections.election, 
            categories: this.props.reduxState.budget.pastBudget}})
    }
    //everything in h1,h2,h2 will come from "elections" DB table via Redux Store
    //everything in the table body will come from "candidates" and "budget_allocation" DB tables  via Redux Store
    render = () => {
        let categories = this.props.reduxState.budget.pastBudget;
        let candidates = this.props.reduxState.candidates.allCandidates;
        let date = new Date(this.props.reduxState.elections.election.date);
        date = date.toUTCString()
        date = date.substring(0, 16);
        return (
            <div className="standard_container">
                <div class="left_just">
                    <Button color="primary" height="50px" width="100px"onClick={this.handleBack}>Back to elections</Button>
                </div>
                <h1>{this.props.reduxState.elections.election.name}</h1>
                <h3>{this.props.reduxState.elections.election.location}</h3>
                <h3>{date}</h3>
                <Button color="primary" onClick={this.editElection}>Edit Election</Button>

                <br />
          
                <Button color="primary" onClick={this.addCandidate}>Add Candidate</Button>
                <br></br>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            {categories &&
                                categories.map((category) => {
                                    return (
                                        <TableCell><b>{category.name}</b></TableCell>
                                    )
                                })
                            }

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {candidates.map(candidate => (
                            <TableRow>
                                <TableCell variant="head" >{candidate.name}</TableCell>
                                {categories.map((category) => {
                                    return (
                                        <TableCell variant="head" >{candidate.budget[category.id]}</TableCell>
                                    )
                                })}
                                <Button variant="outlined" color="secondary" onClick={()=>this.requestBudget(candidate)}>Request Budget</Button> 
                                <Button variant="outlined" color="secondary" onClick={(event) => this.editCandidate(event, candidate.id)}>Edit</Button>
                                <Button variant="outlined" color="secondary" onClick={(event) => this.removeCandidate(event, candidate.id)}>Remove</Button>
                            </TableRow>))}
                    </TableBody>
                </Table>
                
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(AdminElection);