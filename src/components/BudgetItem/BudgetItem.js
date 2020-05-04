import React, { Component } from 'react';
import './BudgetItem.css'
import { connect } from 'react-redux';

// Item that displays things about the clicked on election
// item is the election past budget information from the pastElection reducer

class BudgetItem extends Component {

    render() {
         // formatter Turns VARCHAR to MONEY
         const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })
        return (
            <div class="over">
                {this.props.item.name}: {formatter.format(this.props.item.past_allocation)}<br /><br />
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(BudgetItem);