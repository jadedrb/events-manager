import React from 'react';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';

import { toggleEventDetails } from '../actions/actions'

import '../styles/event.css'

const Event = ({ event }) => {

    let dispatch = useDispatch()
    let history = useHistory()

    const handleClick = () => {
        dispatch(toggleEventDetails(event))
        history.replace(`/events/${event.id}`)
    }

    const displayDate = () => {
        if (event.type === 'langar') {
            let { mm, yy, dd } = event.langarDate
            return `${mm}/${dd}/${yy}` 
        }
        else {
            let sd = event.startDate.split("-")
            console.log(sd)
            return `${sd[1]}/${sd[2]}/${sd[0]}`
        }
    }

    return ( 
        <div className='event' onClick={handleClick}>
            <h3>{event.place}</h3>
            <h4>{displayDate()}</h4>
            <h5>{event.type}</h5>
        </div>
    );
}
 
export default Event;