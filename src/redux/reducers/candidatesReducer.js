import { combineReducers } from 'redux';

//sets all candidates in an array
const allCandidates = (state = [], action) => {
    switch (action.type) {
        case 'SET_ALL_CANDIDATES':
            return action.payload;
        default:
            return state;
    }
};

// sorts candidates by how close their budget's are to the user's budget
const sortCandidates = (state = [], action) => {
    switch (action.type) {
        case 'SORT_CANDIDATES':
            return action.payload;
        default:
            return state;
    }
};

export default combineReducers({
    allCandidates,
    sortCandidates,
});