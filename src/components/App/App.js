import React, { Component } from 'react';
import {
    HashRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import UserPage from '../UserPage/UserPage';
import Home from '../Home/Home';
import Budget from '../Budget/Budget';
import Results from '../Results/Results';
import AdminLogin from '../AdminLogin/AdminLogin';
import LoginPage from '../LoginPage/LoginPage';
import LogOutButton from '../LogOutButton/LogOutButton';
import AdminHome from '../AdminHome/AdminHome';
import AdminElection from '../AdminElection/AdminElection';
import AddCandidate from '../AddCandidate/AddCandidate';
import AdminNewElection from '../AdminNewElection/AdminNewElection';
import RegisterPage from '../RegisterPage/RegisterPage';
import EditCandidate from '../editCandidate/editCandidate'
import EditElection from '../EditElection/EditElection';
import './App.css';

class App extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER' })
    }

    render() {
        return (
            <Router>
                <div>
                    <Nav />
                    <Switch>
                        {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
                        <Redirect exact from="/" to="/home" />
                        {/* Visiting localhost:3000/about will show the about page.
                        This is a route anyone can see, no login necessary */}
                        <Route
                            exact
                            path="/home"
                            component={Home}
                        />
                        <Route
                            exact
                            path="/budget"
                            component={Budget}
                        />
                        <Route
                            exact
                            path="/budget/:id"
                            component={Budget}
                        />
                        <Route
                            exact
                            path="/results"
                            component={Results}
                        />
                        <Route
                            exact
                            path="/adminLogin"
                            component={AdminLogin}
                        />
                        <Route
                            exact
                            path="/userPage"
                            component={UserPage}
                        />
                        <Route
                            exact
                            path="/loginPage"
                            component={LoginPage}
                        />
                        <Route
                            exact
                            path="/logOutButton"
                            component={LogOutButton}
                        />
                        <Route
                            exact
                            path="/registerPage"
                            component={RegisterPage}
                        />
                        {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
                        <ProtectedRoute
                            exact
                            path="/adminHome"
                            component={AdminHome}
                        />
                        <ProtectedRoute
                            exact
                            path="/addCandidate"
                            component={AddCandidate}
                        />
                        <ProtectedRoute
                            exact
                            path="/editCandidate"
                            component={EditCandidate}
                        />
                        <ProtectedRoute
                            exact
                            path="/adminElection"
                            component={AdminElection}
                        />
                        <ProtectedRoute
                            exact
                            path="/adminNewElection"
                            component={AdminNewElection}
                        />
                        <ProtectedRoute
                            exact
                            path="/editElection"
                            component={EditElection}
                        />
                        {/* This works the same as the other protected route, except that if the user is logged in,
            they will see the info page instead. */}
                        {/* <ProtectedRoute
              exact
              path="/info"
              component={InfoPage}
            /> */}
                        {/* If none of the other routes matched, we will show a 404. */}
                        <Route render={() => <h1>404</h1>} />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        )
    }
}

export default connect()(App);