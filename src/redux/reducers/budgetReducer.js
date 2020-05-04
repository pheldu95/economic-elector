import { combineReducers } from 'redux';

// pastBudget holds the previous budget for the election
const pastBudget = (state = [], action) => {
    switch (action.type) {
        case 'SET_BUDGET':
            return action.payload;
        default:
            return state;
    }
};



const results = (state = {}, action) => {
    switch (action.type) {
        case 'SET_RESULTS':
            return action.payload;
        default:
            return state;
    }
};

// sets the user's budget
const userBudget = (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER_BUDGET':
            return action.payload;
        default:
            return state;
    }
};

export default combineReducers({
    pastBudget,
    results,
    userBudget,
});