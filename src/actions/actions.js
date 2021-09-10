export const ADD_EVENT = 'ADD_EVENT'
export const addEvent = (data) => ({
    type: ADD_EVENT,
    payload: data
})

export const SET_EVENT = 'SET_EVENT'
export const setEvent = (data) => ({
    type: SET_EVENT,
    payload: data
})

export const TOGGLE_EVENT_DETAILS = 'TOGGLE_EVENT_DETAILS'
export const toggleEventDetails = (data) => ({
    type: TOGGLE_EVENT_DETAILS,
    payload: data
})