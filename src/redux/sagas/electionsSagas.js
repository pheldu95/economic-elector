import Axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* electionsSagas() {
    yield takeLatest('INPUT_NEW_ELECTION', postNewElection);
    yield takeLatest('FETCH_ELECTION', fetchElection);
    yield takeLatest('DELETE_ELECTION', deleteElection);
    yield takeLatest('EDIT_ELECTION', editElection)
    yield takeLatest('FETCH_ALL_ELECTIONS', fetchAllElections)
}

function* fetchAllElections(action){
    try{
        const response = yield Axios.get('/api/elections/all');
        console.log(response);
        yield put({type: 'SET_ALL_ELECTIONS', payload: response.data})
    }catch(error){
        console.log('error getting all elections', error);
        
    }
}

// POST to create new election row in elections table of DB
// response provides the RETURNING newElection id which is used
// to dispay on next page
function* postNewElection(action) {
    console.log('in postNewElection Saga', action);
    try {
        let response = yield Axios.post('/api/elections/newElection', action.payload);
        let election = response.data.rows[0];
        // console.log('election response', response);
        console.log('election', election);
        yield put({
            type: 'SET_ELECTION', payload: election
        })
        yield put({
            type: 'SET_ALL_CANDIDATES',
            payload: []
        })
        yield put({
            type: 'FETCH_BUDGET',
            payload: election.id
        })
    }
    catch (error) {
        console.log(error);
    }
}

//this function will GET all the info for an election and put it 
//the elections reducer
function* fetchElection(action){
    console.log('payload from AdminElectionListItem', action.payload);
    let response = yield Axios({
        method: 'GET',
        url: `/api/elections/${action.payload.id}`
    })
    console.log(response.data);
    yield put({type:'SET_ELECTION', payload: response.data})
}

function* deleteElection(action) {
    console.log('in deleteElection saga, ID:', action.payload);
    try {
        yield Axios.delete(`/api/elections/deleteElection/${action.payload.electionId}`);
        //update the list of elections
        yield put({ type: 'FETCH_ALL_ELECTIONS' })
    } catch (error) {
        console.log(error);
    }
}

function* editElection(action){
    try {
        //send the edits to the db
        yield Axios({
            method: 'PUT',
            url: `/api/elections/editElection/${action.payload.id}`,
            data: action.payload
        })
        //set the election after the edits have been made. so the updated info is displayed
        yield put({
            type: 'SET_ELECTION',
            payload: {
                        id: action.payload.id,
                        name: action.payload.name,
                        location: action.payload.location,
                        date: action.payload.date
                    }
            })
        //fetch the budget again with the new budget category amounts
        yield put({type: 'FETCH_BUDGET', payload: action.payload.id});
    } catch (error) {
        console.log(error);
    }

}

export default electionsSagas;