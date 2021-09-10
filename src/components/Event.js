import React from 'react';
import { useDispatch } from 'react-redux'

import { toggleEventDetails } from '../actions/actions'

const Event = ({ event }) => {

    let dispatch = useDispatch()

    const handleClick = () => {
        alert('clicked')
        dispatch(toggleEventDetails(event))
    }

    return ( 
        <div className='event' onClick={handleClick}>
            <h3>{event.place}</h3>
        </div>
    );
}
 
export default Event;