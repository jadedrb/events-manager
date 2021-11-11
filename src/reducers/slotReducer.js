import { ADD_SLOT, DELETE_SLOT, SET_SLOT, UPDATE_SLOT } from '../actions/slotActions'

export const initialState = {
    slots: []
}

export default function slotReducer(state = initialState, action) {
    switch(action.type) {
        case ADD_SLOT:
            return {
                ...state,
                slots: [...state.slots, action.payload]
            }
        case SET_SLOT:
            return {
                ...state,
                slots: action.payload
            }
        case DELETE_SLOT:
            return {
                ...state,
                slots: state.slots.filter(s => s.id !== action.payload)
            }
        case UPDATE_SLOT:
            return {
                ...state,
                slots: state.slots.map(s => s.id === action.payload.id ? action.payload : s)
            }
        default:
            return state
    }
}
