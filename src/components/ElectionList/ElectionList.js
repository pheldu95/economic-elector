import React, { Component } from 'react';
import '../App/App.css';
import Election from '../Election/Election';
import { connect } from 'react-redux';
import { List, ListItem } from '@material-ui/core';


class ElectionList extends Component {
    render() {
        return (

            <div className="ElectionList">
                
                    {this.props.electionList.map(election => (<List key={election.id}><Election election={election} /></List>))}
                
            </div>

        );
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(ElectionList);