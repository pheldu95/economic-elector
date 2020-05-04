import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TableCell } from '@material-ui/core';

// Item that displays things about the clicked on election
// item is the election past budget information from the pastElection reducer

class Candidate extends Component {

    // Calculates totalDiff for table and returns it
    totalDiff = () => {
        for( let i=0; i<this.props.diff.length; i++){
            if(this.props.candidate.difference === this.props.diff[i].diff){
                return this.props.diff[i].diff
            }
        }
    }

    render() {
        // formatter turns VARCHAR into MONEY
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        // short hand
        const categories = this.props.reduxState.budget.pastBudget;
        const totalBudget = Number(this.props.candidate.budget[categories[0].id] + this.props.candidate.budget[categories[1].id] + this.props.candidate.budget[categories[2].id] + this.props.candidate.budget[categories[3].id] + this.props.candidate.budget[categories[4].id] + this.props.candidate.budget[categories[5].id] + this.props.candidate.budget[categories[6].id])
            return(
            <>
                <TableCell>{this.props.candidate.name}</TableCell>
                <TableCell>{formatter.format(this.totalDiff())}</TableCell>
                <TableCell>{formatter.format(totalBudget)}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[0].id])}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[1].id])}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[2].id])}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[3].id])}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[4].id])}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[5].id])}</TableCell>
                <TableCell>{formatter.format(this.props.candidate.budget[categories[6].id])}</TableCell>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(Candidate);