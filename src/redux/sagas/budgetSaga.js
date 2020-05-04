import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchBudget(action) {
    try {
        const response = yield axios.get(`/api/elections/budget/${action.payload}`);

        // now that the session has given us a user object
        // with an id and username set the client-side user object to let
        // the client-side code know the user is logged in
        yield put({ type: 'SET_BUDGET', payload: response.data });
    } catch (error) {
        console.log('Budget GET request failed', error);
    }
}


function* findResults(action) {
    try {
        //get all the candidates
        const response = yield axios.get(`/api/candidates/all/${action.payload}`);
        //put the results into the results reducer. in budgetReducer.js
        yield put({ type: 'SET_RESULTS', payload: response.data });
    } catch (error) {
        console.log('error in Getting candidates', error);
    }
}

function* userBudget(action) {
    //send the users budget to the userBudget reducer in budgetReducer.js
    put({ type: 'SET_USER_BUDGET', payload: action.payload })
}

//this function sends the candidate and the message to the db to get emailed off
//the post goes to email.router.js
function* sendBudgetRequest(action){
    console.log(action.payload);
    try{
        let candidate = action.payload.candidate;
        let election = action.payload.election
        let message = `<h2> Hello ${candidate.name}, please send us your proposed budget for the ${election.name} position you are running for</h2>`
        yield axios.post(`/api/email`, {candidate: candidate, message: message});
    } catch (error) {
        console.log('error in emailingcandidates', error);
    }
}

//adds a new category for an election to the db
function* addCategory(action){
    console.log(action.payload);
    let info = action.payload;
    try{
        yield axios.post(`/api/category/add/${action.payload.election_id}`, {name: info.name, amount: info.amount, candidates: action.payload.candidates})
        //fetch budget again. the new budget that comes back from the db should have the new category in it
        yield put({ type: 'FETCH_BUDGET', payload: action.payload.election_id })
        //fetch candidates again so their column for the new budget category displays a $0
        yield put({ type: 'FETCH_CANDIDATES', payload: action.payload.election_id })

    }catch(error){
        console.log('error in addCategory saga', error);
    }
}

//delete a category from the an election in the db
function* removeCategory(action){
    console.log(action.payload);
    try{
        yield axios.post(`/api/category/delete/${action.payload.budget_category_id}`, {candidates: action.payload.candidates});
        //fetch candidates again so the array of candidates doesn't have the old budget category that was deleted
        yield put({ type: 'FETCH_CANDIDATES', payload: action.payload.election_id })

    }catch (error) {
        console.log('error removeCategory in budgetSaga', error);
    }
}

function* userSaga() {
    yield takeLatest('FETCH_BUDGET', fetchBudget);
    yield takeLatest('FIND_CANDIDATE', findResults);
    yield takeLatest('SET_USER_BUDGET', userBudget);
    yield takeLatest('SEND_BUDGET_REQUEST', sendBudgetRequest);
    yield takeLatest('ADD_NEW_CATEGORY', addCategory);
    yield takeLatest('REMOVE_CATEGORY', removeCategory);
}

export default userSaga;