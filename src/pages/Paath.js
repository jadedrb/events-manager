import React from 'react'
import TimeSlots from '../components/TimeSlots';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import '../styles/paath.css'

const Paath = () => {
    let params = useParams()
    let paath = useSelector((state) => state.events.events.filter((e) => e.id === params.id)[0]);
    
    return (
        <div>
            {paath &&
                <div className='event-details'>
                    <p className='event-p'><span>{paath.place.toUpperCase()}</span><span>type: {paath.type}</span> <span></span></p>
                    <TimeSlots event={paath} />
                </div>
            }
        </div>
    )
}

export default Paath;