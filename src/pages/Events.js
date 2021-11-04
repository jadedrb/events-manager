import React from 'react';
import Event from '../components/Event';
import Modal from '../components/Modal';
import EventModal from '../components/EventModal';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { setEvent, toggleEventDetails } from '../actions/actions'

const Events = () => {

    let dispatch = useDispatch()
    let events = useSelector(state => state.events.events)
    let details = useSelector(state => state.events.details)

    const renderEvents = () => {
        return events.map(event => <Event key={event.id} event={event} />)
    }

    const toggleDetails = () => dispatch(toggleEventDetails(false))

    const renderModal = () => {
        if (details)
        return (
            <Modal>
                <div className='event-modal'>
                    <div></div>
                </div>
                <div className='event-modal-cloud' onClick={toggleDetails}></div>
            </Modal>
        )
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