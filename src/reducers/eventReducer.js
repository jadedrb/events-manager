import { ADD_EVENT, SET_EVENT, TOGGLE_EVENT_DETAILS } from '../actions/actions';

export const initialState = {
    events: [],
    details: false
}

export default function eventReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_EVENT:
            return {
                ...state,
                events: [...state.events, action.payload]
            };
        case SET_EVENT:
            return {
                ...state,
                events: action.payload
            }
        case TOGGLE_EVENT_DETAILS:
            return {
                ...state,
                details: !state.details ? action.payload : false
            }
        default:
            return state;
    }
}