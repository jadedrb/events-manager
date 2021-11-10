import React from 'react';
import Event from '../components/Event';

import { useSelector } from 'react-redux'
// import { useHistory } from 'react-router-dom'

// import { toggleEventDetails } from '../actions/actions'

const Events = () => {

    // let dispatch = useDispatch()
    // let history = useHistory()
    let events = useSelector(state => state.events.events)
    let details = useSelector(state => state.events.details)

    const renderEvents = () => {
        return events.filter((e) => e.type === 'paath').map(event => <Event key={event.id} event={event} />)
    }

    // const toggleDetails = () => {
    //     dispatch(toggleEventDetails(false))
    //     history.replace('/events')
    // }

    const renderModal = () => {
        if (details)
            return null
        else 
            return null
    }

    console.log(events)

    return (
        <div>
            {renderEvents()}
            {renderModal()}

            {/* Temporary buttons for Local Storage management */}
            <button
                className="flush"
                onClick={() => { localStorage.removeItem("events"); alert('Local Storage (events) cleared.') }}
                style={{ padding: "10px", cursor: "pointer" }}
            >
                Clear Local Storage (events)
            </button>
            <button
                className="flush"
                onClick={() => { localStorage.removeItem("slots"); alert('Local Storage (slots) cleared.') }}
                style={{ padding: "10px", cursor: "pointer" }}
            >
                Clear Local Storage (slots)
            </button>
            <button
                className="flush"
                onClick={() => { localStorage.clear(); alert('Local Storage (all) cleared.') }}
                style={{ padding: "10px", cursor: "pointer" }}
            >
                Clear Local Storage (all)
            </button>
        </div>
    )
}

export default Events;