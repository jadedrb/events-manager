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
    console.log(currentDate, currentDate.getDay())
    let slots = useSelector(state => state.slots.slots.filter(s => s.id === event.eventId))

    let daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7:'Jul', 8: 'Aug', 9: 'Sep', 10:'Oct',11: 'Nov', 12: 'Dec'}
    //let daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    const calculateTimeRow = (row, col) => {
        if (col !== 0) return
        let baseTime = 5
        let m = row >= 7 ? 'PM' : 'AM';
        if (row >= 1 && row <= 7)
            return (baseTime + row) + m
        switch (baseTime + row) {
            case 13:
                return 1 + m
            case 14:
                return 2 + m
            case 15:
                return 3 + m
            case 16:
                return 4 + m
        }
    }

    let dow = currentDate.getDay()

    const calculateDayOfWeek = (row, col) => {
        if (row !== 0 || col === 0) return
        if (dow > 6) dow = 0
        let result = daysOfWeek[dow]
        let month = months[currentDate.getMonth() + 1]
        let dayy = currentDate.getDate()
        currentDate.setDate(currentDate.getDate() + 1);
        if (col && row === 0) {
            dow++
            return `${month}/${dayy} ${result}`
        }
        else 
            return
    }

    return (
        <div className='t-slots'>
            {[...Array(12)].map((_,i) => {
                return (
                    <div key={i} className='t-slot-row'>
                        {[...Array(days + 1)].map((d,j) => {
                            return (
                                <div key={j} className='t-slot-column'>
                                    {calculateDayOfWeek(i, j)}
                                    {calculateTimeRow(i, j)}
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default TimeSlots