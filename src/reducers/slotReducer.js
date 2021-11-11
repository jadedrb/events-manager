import { ADD_SLOT, SET_SLOT } from '../actions/slotActions'

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
        default:
            return state
    }
}
