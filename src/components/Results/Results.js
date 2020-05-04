// Displays list of candidates most closely aligned to the user in order of lowest total absolute difference between categories. There will also be a “Back to Budget” button which will bring 
// the user back to the budget page (2) for this election.  The results table will show each candidate’s proposed spending for these categories: Law Enforcement, Parks and Rec, Education, 
// First Responders, Public Works, Administration, and Community Development. Our wireframe software only allowed us to include three columns in the table below, but in the actual web app, each category will have a column.

import React, { Component } from 'react';
import Candidate from '../Candidate/Candidate';
import { connect } from 'react-redux';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, LabelSeries, DiscreteColorLegend } from 'react-vis';
import './Results.css'
import { Button } from '@material-ui/core';

class Results extends Component {

    // return function for sort, a and b are elements
    compare = (a,b) => {
        let dif = a.difference - b.difference;
        return dif
    }

    // handles the button to go home
    handleBack = () => {
        this.props.history.push('/home');
    }
    
    // render in Results
    render() {

        const pastData = this.props.reduxState.budget.pastBudget
        const userStuff = this.props.reduxState.budget.userBudget.budget

        // formatter ****-- Turns VARCHAR into MONEY
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })

        // *****-- const for bar graphs using react-vis
        const userData = [{ x: 'Law Enforc', y: Number(userStuff.lawEnforcement)}, { x: 'Parks/Rec', y: Number(userStuff.parksRec) }, { x: 'PublicWorks', y: Number(userStuff.publicWorks) }, { x: 'First Responders', y: Number(userStuff.firstResponders) }, { x: 'Community Dev', y: Number(userStuff.communityDev) }, { x: 'Administration', y: Number(userStuff.administration) }, { x: 'Education', y: Number(userStuff.education) }];

        const currentData = [{ x: 'Law Enforc', y: pastData[0].past_allocation }, { x: 'Parks/Rec', y: pastData[1].past_allocation }, { x: 'PublicWorks', y: pastData[2].past_allocation }, { x: 'First Responders', y: pastData[3].past_allocation }, { x: 'Community Dev', y: pastData[4].past_allocation }, { x: 'Administration', y: pastData[5].past_allocation }, { x: 'Education', y: pastData[6].past_allocation }];

        const labelData = userData.map((d, idx) => ({
            x: d.x,
            y: Math.max(userData[idx].y, currentData[idx].y)
        }));

        const BarSeries = VerticalBarSeries;
        // ****--

        // ***** MATHS *****

        // short hand for MATHS
        const candidates = this.props.reduxState.candidates.allCandidates;
        const categories = this.props.reduxState.budget.pastBudget;

        // Finds the total absolute difference between user info and candidate ****-- Could be updated to be universal
        let diffID = [];
        for( let i=0; i<candidates.length; i++ ){
            let lawDiff = Math.abs(Number(userStuff.lawEnforcement) - candidates[i].budget[categories[1].id] );
            let parksDiff = Math.abs( Number(userStuff.parksRec) - candidates[i].budget[categories[0].id] );
            let publicDiff = Math.abs(Number(userStuff.publicWorks) - candidates[i].budget[categories[4].id] );
            let firstDiff = Math.abs(Number(userStuff.firstResponders) - candidates[i].budget[categories[3].id] );
            let commDiff = Math.abs(Number(userStuff.communityDev) - candidates[i].budget[categories[6].id] );
            let adminDiff = Math.abs(Number(userStuff.administration) - candidates[i].budget[categories[5].id] );
            console.log('adminDiff', adminDiff);
            let educDiff = Math.abs(Number(userStuff.education) - candidates[i].budget[categories[2].id] );
            console.log('educDiff', educDiff);
            let totalDiff = Number(Number(lawDiff) + Number(parksDiff) + Number(publicDiff) + Number(firstDiff) + Number(commDiff) + Number(adminDiff) + Number(educDiff) );
            console.log('total diff for each candidate', totalDiff);
            candidates[i].difference = totalDiff
            diffID.push({
                id: i,
                diff: totalDiff,
                tok: candidates[i].difference
            })
        }

        // sorts candidates by difference
        // ****SORT****
        const sortedCand = candidates.sort(this.compare);
        
        // *Dispatch*
        this.props.dispatch({ type: 'SORT_CANDIDATES', payload: sortedCand });

        // return in Results
        return (
            
            <div className="standard_container">
                <div class="left_just">
                    <Button color="primary" height="50px" width="100px" onClick={this.handleBack}>Back to Elections</Button>
                </div>
                <h1>Your Results</h1>
                <table class="candidates_just">
                    <thead>
                        <tr>
                            <th>Candidate Name </th>
                            <th>Sum of Budget Differences </th>
                            <th>Total Budget </th>
                            <th>Law Enforcement </th>
                            <th>Parks and Rec </th>
                            <th>Public Works </th>
                            <th>First Responders </th>
                            <th>Community Dev </th>
                            <th>Admin </th>
                            <th>Education </th>
                        </tr>
                    </thead>
                    <br></br>
                    <tbody>
                        <tr>
                            <td>Your Budget</td>
                            <td>N/A</td>
                            <td>{formatter.format(userStuff.total)}</td>
                            <td>{formatter.format(userStuff.lawEnforcement)}</td>
                            <td>{formatter.format(userStuff.parksRec)}</td>
                            <td>{formatter.format(userStuff.publicWorks)}</td>
                            <td>{formatter.format(userStuff.firstResponders)}</td>
                            <td>{formatter.format(userStuff.communityDev)}</td>
                            <td>{formatter.format(userStuff.administration)}</td>
                            <td>{formatter.format(userStuff.education)}</td>
                        </tr>
                        <br></br>
                        {this.props.reduxState.candidates.sortCandidates.map(candidate => (<tr key={candidate.id}><Candidate diff={diffID} candidate={candidate} /></tr>))}
                    </tbody>
                </table>
                <div className="graph_just">
                    <XYPlot xType="ordinal" width={700} height={700}  margin={{ left: 100 }}>
                        <DiscreteColorLegend
                                orientation="horizontal"
                                items={[
                                    {
                                        title: ' Your Budget',
                                        color: '#12939A'
                                    },
                                    {
                                        title: ' Current Budget',
                                        color: '#79C7E3'
                                    }
                                ]}
                            />
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis tickLabelAngle={-10} />
                        <YAxis left={25}/>
                        <BarSeries data={userData} />
                        <BarSeries data={currentData} />
                        <LabelSeries data={labelData} />
                    </XYPlot>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
                <Button style={{ marginBottom: '20px' }} variant="outlined" color="primary" height="50px" width="100px" onClick={window.print}>Print My Ballot</Button>
            </div>
        );
    }
}

// access to redux store
const mapStateToProps = (reduxState) => ({
    reduxState
});

//export Results
export default connect(mapStateToProps)(Results);