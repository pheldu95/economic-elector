import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import HomeIcon from '@material-ui/icons/Home';

const Nav = (props) => (
    <div className="nav">
        <Link to="/home">
            <h1 className="nav-title" style={{fontSize: 40}}>Economic Elector</h1>
        </Link>
        <div className="nav-right">
            <Link className="nav-link" to="/home" style={{display:'flex'}}>
                {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}
                <div style={{}}>
                    <HomeIcon style={{ fontSize: 40 }}/>
                </div>
                {/* {props.user.id ? 'Home' : 'Home'} */}
                
            </Link>
            {/* Show the link to the info page and the logout button if the user is logged in */}
            {props.user.id && (
                <>
                    {/* <Link className="nav-link" to="/info">
            Info Page
          </Link> */}
                    <LogOutButton className="nav-link" />
                </>
            )}
            {/* Always show this link since the about page is not protected */}
            {/* <Link className="nav-link" to="/about">
        About
      </Link> */}

            {/* <Link to="/Budget">
                <h2 className="nav-link">User Budget</h2>
            </Link>
            <Link to="/AdminHome">
                <h2 className="nav-link">Admin Home</h2>
            </Link>
            <Link to="/AdminElection">
                <h2 className="nav-link">Admin Election</h2>
            </Link>
            <Link to="/AdminNewElection">
                <h2 className="nav-link">Admin New Election</h2>
            </Link>

            <Link to="/AddCandidate">
                <h2 className="nav-link">Admin Add Candidate</h2>
            </Link> */}
        </div>
    </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Nav);
