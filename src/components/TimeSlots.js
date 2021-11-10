import React, { useState, useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'

const TimeSlots = ({ event }) => {

    let { startDate, endDate } = event
    let slotDateRef = useRef({})
    let slotTimeRef = useRef({})
    let slotDisableRef = useRef({})
    let [days] = useState((new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24)
    
    // let [slotTable, setSlotTable] = useState(null)
    // let slots = useSelector(state => state.slots.slots.filter(s => s.id === event.eventId))

    useEffect(() => {

        setTimeout(() => {
            console.log(slotDateRef.current)
            console.log(slotTimeRef.current)
            console.log(slotDisableRef.current)
        }, 1000)


    }, [])

    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1);

    let daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    // var months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7:'Jul', 8: 'Aug', 9: 'Sep', 10:'Oct',11: 'Nov', 12: 'Dec'}

    const calculateTimeRow = (row, col) => {
        if (col !== 0 || row === 0) return
        let baseTime = 5
        let m = row >= 7 ? 'PM' : 'AM';
        let result;
        
        if (row >= 1 && row <= 7)
            result = (baseTime + row) + m
        switch (baseTime + row) {
            case 13:
                result = 1 + m
                break;
            case 14:
                result = 2 + m
                break;
            case 15:
                result = 3 + m
                break;
            case 16:
                result = 4 + m
                break;
            case 17:
                result = 5 + m
                break;
            default:
                break;
        }

        slotTimeRef.current[`${row}`] = result
        return result
    }

    const handleSlotClick = (e) => {
        let [row, col] = e.target.id.split("-")
        let time = slotTimeRef.current[row]
        let date = slotDateRef.current[col]
        if (!time || !date || e.target.className.includes('d-slot')) return
        console.log(`You clicked on slot ${e.target.id}, which is ${slotTimeRef.current[row]} on ${slotDateRef.current[col]}`)
    }

    let dow = currentDate.getDay()

    const calculateDayOfWeek = (row, col) => {
        if (row !== 0 || col === 0) return
        if (dow > 6) dow = 0
        let result = daysOfWeek[dow]
        let month = currentDate.getMonth() + 1
        let dayy = currentDate.getDate()
        currentDate.setDate(currentDate.getDate() + 1);
        if (result === 'Sun') slotDisableRef.current[`${col}`] = true
        if (col && row === 0) {
            dow++
            slotDateRef.current[`${col}`] = `${month}/${dayy} ${result}`
            return `${month}/${dayy} ${result}`
        }
        else 
            return
        
    }

    const disableOrNot = (row, col) => {
        if (slotDisableRef.current[`${col}`]) {
            if (row > 1 && row < 10) 
                return 'd-slot'
        }
        return ''
    }

    return (
        <div className='t-slots'>
            {[...Array(13)].map((_,i) => {
                return (
                    <div key={i} className={`t-slot-row ${!i ? 'r-dates' : ''}`}>
                        {[...Array(days + 1)].map((_,j) => {
                            return (
                                <div 
                                    key={j} 
                                    id={`${i}-${j}`} 
                                    className={`t-slot-column c-${j} r-${i} ${disableOrNot(i, j)}`}
                                    onClick={handleSlotClick}
                                >
                                    <span>
                                        {calculateDayOfWeek(i, j)}
                                        {calculateTimeRow(i, j)}
                                    </span>
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








/*

let slotTable = [...Array(12)].map((_,i) => {
            return (
                <div key={i} className={`t-slot-row ${!i ? 'r-dates' : ''}`}>
                    {[...Array(days + 1)].map((_,j) => {
                        return (
                            <div 
                                key={j} 
                                id={`${i}-${j}`} 
                                className={`t-slot-column c-${j} r-${i}`}
                                onClick={handleSlotClick}
                            >
                                <span>
                                    {calculateDayOfWeek(i, j)}
                                    {calculateTimeRow(i, j)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )
        })

        setSlotTable({ slotTable })

*/