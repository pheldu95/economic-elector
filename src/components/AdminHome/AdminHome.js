import React, { Component } from 'react';
import axios from 'axios';
import AdminElectionListItem from './AdminElectionListItem'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, List } from '@material-ui/core';

import './AdminHome.css';

class AdminHome extends Component {
    state = {
        elections: []
    }

    componentDidMount = () => {
        this.props.dispatch({type:'FETCH_ALL_ELECTIONS'})
        this.getElections();
    }

    //i just have the axios get request in here instead of in a saga
    //since we don't to save the data to a reducer. 
    getElections = () => {
        axios({
            method: 'GET',
            url: '/api/elections/all'
        }).then((response) => {
            console.log('all elections', response.data)
            this.setState({
                elections: response.data
            })
        }).catch((error) => {
            console.log(error);
            alert(error);
        })
    }
    //on button click bring admin user to adminNewElection page
    addNewElection = () => {
        this.props.history.push('/adminNewElection')
    }

    render() {
        return (
            <div class="standard_container">
                <h1>Available Elections</h1>
                <br />
                <Button variant="contained"  color="primary" onClick={this.addNewElection}>Add New Election</Button>
                <br /><br />
                <List>
                    {this.props.reduxState.elections.allElections.map((election) => {
                        return (
                            <AdminElectionListItem election={election} />
                        )
                    })}
                </List>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});
export default withRouter(connect(mapStateToProps)(AdminHome));