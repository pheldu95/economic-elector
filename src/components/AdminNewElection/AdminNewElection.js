import React, { Component } from 'react';
import '../App/App.css';
import { connect } from 'react-redux';
import { Button, Input } from '@material-ui/core';


class AdminNewElection extends Component {

    state = {
        newElection: {
            office: '',
            location: '',
            date: '',
            lawEnforcement: '',
            parksRec: '',
            publicWorks: '',
            firstResponders: '',
            communityDev: '',
            administration: '',
            education: '',
        },
    }
    //set state that matched param from input
    handleNameChange = (event, param) => {
        this.setState({
            newElection: {
                ...this.state.newElection,
                [param]: event.target.value,
            }
        });
    }
    //on button click check that inputs aren't blank and alert if blank, then call to saga to post inputs to Db, 
    //then clear state and bring user to adminElection page
    addNewElection = event => {

        event.preventDefault();

        if (this.state.newElection.office === '' ||
            this.state.newElection.location === '' ||
            this.state.newElection.date === '' ||
            this.state.newElection.lawEnforcement === '' ||
            this.state.newElection.parksRec === '' ||
            this.state.newElection.publicWorks === '' ||
            this.state.newElection.firstResponders === '' ||
            this.state.newElection.communityDev === '' ||
            this.state.newElection.administration === '' ||
            this.state.newElection.education === '') {

            alert('Please make a selection for all inputs');

        } else {

            this.props.dispatch ({
                type: 'INPUT_NEW_ELECTION',
                payload: this.state.newElection
            });
            this.setState ({
                newElection: this.state.newElection
            });
        }
        this.setState ({
            newElection: {
                office: '',
                location: '',
                date: '',
                lawEnforcement: '',
                parksRec: '',
                publicWorks: '',
                firstResponders: '',
                communityDev: '',
                administration: '',
                education: ''
            }
        });
        this.props.history.push('/adminElection');
    }
    //on button click bring user back to adminHome
    handleBack = () => {
        this.props.history.push('/adminHome');
    }

    //secret button for our presentation
    // secretButton = () =>{
    //     this.setState({
    //         newElection: {
    //             ...this.state.newElection,
    //             office: 'Mayor',
    //             location: 'Edina',
    //             lawEnforcement: 14517004,
    //             parksRec: 12158792,
    //             publicWorks: 5872135,
    //             firstResponders: 5860604,
    //             communityDev: 2320363,
    //             administration: 4467514,
    //             education: 6320363,
    //         }
    //     })
    //     console.log(this.state.newElection);
    // }
    

    render = () => {
        return (

            <div className="standard_container">
                <div className="left_just">
                    <Button color="primary" height="50px" width="100px" onClick={this.handleBack}>Back to elections</Button>
                </div>
                <form onSubmit={this.addNewElection} className="newElection">

                    {/* <h1 onClick={this.secretButton}>New Election</h1> */}
                    <h1>New Election</h1>

                <label>
                    Election Office:
                    <Input value={this.state.newElection.office} onChange={(event) => this.handleNameChange(event, 'office')}></Input>
                </label>


                    <br /><br />


                <label>
                    Location:
                    <Input value={this.state.newElection.location} onChange={(event) => this.handleNameChange(event, 'location')}></Input>
                </label>


                    <br /><br />


                <label>
                    Date:
                    <Input type='date' placeholder="date" value={this.state.value} onChange={(event) => this.handleNameChange(event, 'date')}></Input>
                </label>


                    <br /><br />

                    <h1>Prior Year's Budget Distribution</h1>


                <br />

                <label>
                    Law Enforcement:
                    <Input value={this.state.newElection.lawEnforcement} onChange={(event) => this.handleNameChange(event, 'lawEnforcement')}></Input>
                </label>


                    <br /><br />

                <label>
                    Parks/Rec:
                    <Input value={this.state.newElection.parksRec} onChange={(event) => this.handleNameChange(event, 'parksRec')}></Input>
                </label>


                    <br /><br />


                <label>
                    Public Works:
                    <Input value={this.state.newElection.publicWorks} onChange={(event) => this.handleNameChange(event, 'publicWorks')}></Input>
                </label>


                    <br /><br />

                <label>
                    First Responders:
                    <Input value={this.state.newElection.firstResponders} onChange={(event) => this.handleNameChange(event, 'firstResponders')}></Input>
                </label>


                    <br /><br />

                <label>
                    Community Development:
                    <Input value={this.state.newElection.communityDev} onChange={(event) => this.handleNameChange(event, 'communityDev')}></Input>
                </label>


                    <br /><br />

                <label>
                    Administration:
                    <Input value={this.state.newElection.administration} onChange={(event) => this.handleNameChange(event, 'administration')}></Input>
                </label>


                    <br /><br />

                <label>
                    Education:
                    <Input value={this.state.newElection.education} onChange={(event) => this.handleNameChange(event, 'education')}></Input>
                </label>


                    <br /><br />

                    <Button variant="outlined" color="primary" onClick={this.addNewElection}>Create Election</Button>


                    <br /><br />

                    <Button variant="outlined"color="secondary" className="center" type="reset" onClick={this.handleBack}><b>Cancel</b></Button>


                </form>
            </div>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapStateToProps)(AdminNewElection);