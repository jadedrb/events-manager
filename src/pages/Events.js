import React from 'react';
import Event from '../components/Event';
import EventModal from '../components/EventModal';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { toggleEventDetails } from '../actions/actions'

const Events = () => {

    let dispatch = useDispatch()
    let history = useHistory()
    let events = useSelector(state => state.events.events)
    let details = useSelector(state => state.events.details)

    const renderEvents = () => {
        return events.map(event => <Event key={event.id} event={event} />)
    }

    const toggleDetails = () => {
        dispatch(toggleEventDetails(false))
        history.replace('/events')
    }

    const renderModal = () => {
        if (details)
            return <EventModal toggleDetails={toggleDetails} />
        else 
            return null
    }

    console.log(events)

    return (
        <div>
            {renderEvents()}
            {renderModal()}
            <button id="flush" onClick={() => localStorage.clear() }>...</button>
        </div>
    )
}

export default Events;