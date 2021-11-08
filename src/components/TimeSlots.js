import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const TimeSlots = ({ event }) => {

    let { startDate, endDate } = event

    let [days] = useState((new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24)

    

    console.log(days)
    // console.log(new Date(days))
// 6am - 5pm (11hrs)
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1);
    console.log(currentDate)
    let slots = useSelector(state => state.slots.slots.filter(s => s.id === event.eventId))

    return (
        <div className='t-slots'>
            {[...Array(11)].map((_,i) => {
                return (
                    <div key={i} className='t-slot-row'>
                        {[...Array(days)].map((d,j) => {
                            return (
                                <div key={j} className='t-slot-column'>slot</div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default TimeSlots