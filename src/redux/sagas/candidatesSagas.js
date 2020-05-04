import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

function* candidatesSagas() {
    yield takeLatest('ADD_CANDIDATE', postCandidate);
    yield takeEvery('FETCH_CANDIDATES', fetchCandidates);
    yield takeLatest('DELETE_CANDIDATE_FROM_LIST', deleteCandidate);
    yield takeEvery('EDIT_CANDIDATE', editCandidate);
}

function* postCandidate(action) {

    try {
        console.log(action.payload);
        //the response should be the candidate id        
        let response = yield axios.post('/api/candidates', action.payload)
        console.log(response.data.rows[0].id, "should be the candidate ID");
        let candidate_id = response.data.rows[0].id
        let categoryInfo = {};
        //we loop through the object that was sent from the AddCandidate view
        //using a "for... in" loop. this loop will send a post request for each budget allocation 
        // to the server.
        console.log(action.payload.budget);

        for (const category in action.payload.budget) {
            //inside the for in loop, we build a new object to send to the server
            //it holds the category name, the amount of money the candidate is allocating, and the candidate id
            console.log(category);

            categoryInfo = { category_id: action.payload.budget[category].id, amount: action.payload.budget[category].amount, candidate_id: candidate_id }
            console.log(categoryInfo);

            //then we send it to be posted
            yield axios.post('/api/candidates/budget', categoryInfo);
        }
        yield put({ type: 'FETCH_CANDIDATES', payload: action.payload.election_id });
    } catch (error) {
        console.log(error);
    }
}

function* fetchCandidates(action) {
    console.log('election id for candidate fetch:', action.payload)
    //get all their candidates
    let response = yield axios.get(`/api/candidates/all/${action.payload}`);
    let candidates = response.data;
    console.log(candidates, 'all candidates');
    //get their budgets
    response = yield axios.get(`/api/candidates/allBudgets/${action.payload}`);
    let candidateBudgets = response.data
    console.log('candidate budgets', candidateBudgets);
    //loop through candidates and add their budget onto them
    let candidateId
    //use a for loop to add the candidates budget to each candidate object in the array
    //of candidates
    for (let i = 0; i < candidates.length; i++) {
        candidateId = candidates[i].id
        //here we are creating a new property for the object called 'budget'
        //and giving it the budget that has the same candidate id
        candidates[i].budget = candidateBudgets[candidateId];
        console.log('candidate budget added', candidates[i]);
    }
    yield put({ type: 'SET_ALL_CANDIDATES', payload: candidates });

}

function* deleteCandidate(action) {
    console.log('in deleteCandidate saga, ID:', action.payload);
    try {
        //delete the candidate from the db
        yield axios.delete(`/api/candidates/deleteCandidate/${action.payload.candidate}`);
        //update the array of candidates after the delete by sending another 'FETCH CANDIDATES' dispatch
        yield put({ type: 'FETCH_CANDIDATES', payload: action.payload.electionId })
    } catch (error) {
        console.log(error);
    }
}

function* editCandidate(action) {
    console.log("in editCandidate, here's your payload ", action.payload);
    try {
        //send the edits for a candidate to the db
        yield axios.put(`/api/candidates/editCandidate/${action.payload.id}`, action.payload);
        //update the array of candidates after the edit by sending another 'FETCH CANDIDATES' dispatch
        yield put({ type: 'FETCH_CANDIDATES', payload: action.payload.election_id })
    } catch (error) {
        console.log(error);
    }
}

export default candidatesSagas;