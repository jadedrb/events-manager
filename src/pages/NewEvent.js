import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { v4 as uuid } from 'uuid'

import { addEvent } from '../actions/actions';

import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import '../styles/newEvent.css';

const NewEvent = (props) => {

    let [calendar, setCalendar] = useState(new Date())

    let dispatch = useDispatch()
    let history = useHistory()

    let user = useSelector(state => state.users.currentUser)

    let [event, setEvent] = useState({
        user: user,
        type: '',
        startDate: '',
        endDate: '',
        place: '',
        address: '',
        number: '',
        langarDate: { dd: '', mm: '', yy: '' },
        langarD: '',
        bookedDays: [],
        selectedDay: { dd: '', mm: '', yy: '' }
    })

    useEffect(() => {
        // Determine default dates for Langar type events
        // Using a functional update because otherwise it complains. Besides that nothing different going on here
        setEvent(prevEvent => ({ 
            ...prevEvent, 
            langarDate: { dd: currentDay(), mm: currentMonth(), yy: currentYear() }, 
        }))
  
    }, [])

    useEffect(() => {
        if (!event.startDate) setEvent(prevEvent => ({ ...prevEvent, endDate: '' }))
    }, [event.startDate])

    useEffect(() => {
        // Handles filtering of available days and months for langar events when necessary 
        if (event.type === "langar") {

            let bookedDays = []

            // Find days that have aleady been taken. 
            for (let i = 0; i < props.events.length; i++) {

                let curr = props.events[i]

                if (!curr.langarDate) continue

                let { mm, yy, dd } = curr.langarDate

                // Handle days in current month
                console.log(event.langarDate)
                if (mm === event.langarDate.mm && 
                    yy === event.langarDate.yy) {
                    bookedDays.push(dd)
                }
    
            }
            console.log(bookedDays)

            setEvent(prevEvent => ({ 
                ...prevEvent, 
                bookedDays
            }))
            
        }
    }, [event.langarDate, event.type, event.langarDate.mm, event.langarDate.yy, props.events])

    // Utility functions... maybe to be put in a separate file and exported
    const calcDaysInMonth = (year, month) => new Date(year, month, 0).getDate()
    const currentYear = () => String(new Date().getFullYear())
    const currentMonth = () => String(new Date().getMonth() + 1)
    const currentDay = () => String(new Date().getDay())
    const createMonthArr = (initial, cutoffPoint) => [...Array(initial).keys()].slice(cutoffPoint)
    const calcNextYear = () => Number(currentYear()) + 1

    const formatLangarDate = (date) => {
        let mm = date.getMonth() + 1
        let yy = date.getFullYear()
        let dd = date.getDate()
        if (mm < 10) mm = '0' + mm
        if (dd < 10) dd = '0' + dd
        dd = String(dd)
        mm = String(mm)
        yy = String(yy)
        return { dd, mm, yy }
    }

    const handleChange = (e, e2) => {
        let name, value;

        if (e.target) {
            name = e.target.name
            value = e.target.value
        } else {
            setEvent({ ...event, langarDate: formatLangarDate(e), selectedDay: formatLangarDate(e) })
            return
        }

        setEvent({ ...event, selectedDay: { dd: '', mm: '', yy: '' }, [name]: value})
    }

    const packageEvent = () => {
        let newEvent;
        let baseEvent = { user, id: uuid(), place: event.place, type: event.type }

        if (event.type === "langar") {
            newEvent = {
                ...baseEvent,
                langarDate: event.selectedDay,
                phone: event.number
            }
        } else {
            newEvent = {
                ...baseEvent,
                startDate: event.startDate,
                endDate: event.endDate,
                address: event.address,
            }
        }

        return newEvent
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(event)

        let newEvent = packageEvent()

        history.push('/events')

        dispatch(addEvent(newEvent))

        /*
            (NOTE: All code below can be deleted. Mostly for development purposes)
            
                1. Get pretend backend from local storage
                2. If no pretend backend present, create it
                3. Parse local storage string into javascript object/array
                4. Spread resulting array into new array with new event included
                5. Store the new array in local storage
        */
        
        let currentStorage = localStorage.getItem("events")

        if (!currentStorage) {
            localStorage.setItem("events", JSON.stringify([]))
            currentStorage = localStorage.getItem("events")
        }

        let parsedCurrentEvents = JSON.parse(currentStorage)

        let newStorage = [...parsedCurrentEvents, newEvent]
        let stringNewStorage = JSON.stringify(newStorage)

        localStorage.setItem("events", stringNewStorage)
        
    }

    const handleBookedDayStyle = ({ date, view }) => {
        console.log(event.bookedDays)
        let tileDate = String(date.getDate())
        if (event.bookedDays.includes(tileDate))
            return 'booked-day'
        else 
            return null
    }

    const handleDisabledDays = ({ activeStartDate, date, view }) => {
        let tileDate = String(date.getDate())
        if (event.bookedDays.includes(tileDate))
            return true
        else 
            return false
    }

    const handlePreviousOrNext = ({ action, activeStartDate, value, view }) => {
        console.log('activeStateChange: ', { activeStartDate, value, view, action })
        setEvent({ ...event, langarDate: formatLangarDate(activeStartDate)})
    }

    let greyedOutStyle = {
        opacity: ".1",
        pointerEvents: "none"
    }

    let interact = !event.type ? greyedOutStyle : null 
    let paath = event.type !== "langar" 
    let interactMore = !paath || !event.startDate ? greyedOutStyle : null


    return (
        <form className="ne-form" onSubmit={handleSubmit}>
            
            <label>
                Event Type
                <select defaultValue="choose" onChange={handleChange} name="type" autoFocus>
                    <option value="choose" disabled />
                    <option value="paath">Paath (Prayer)</option>
                    <option value="langar">Langar (Kitchen)</option>
                </select>
            </label>

            {!paath &&
            <label style={interact} id="date-langar">
                Date
                <input 
                    name="endDate" 
                    value={`${event.selectedDay.yy}-${event.selectedDay.mm}-${event.selectedDay.dd}`}
                    type="date" 
                    disabled 
                />
                <Calendar 
                    name={"langarDate"}
                    value={calendar}
                    onChange={setCalendar}
                    minDate={new Date()}
                    maxDetail={"month"}
                    showNeighboringMonth={false}
                    onClickDay={handleChange}
                    tileClassName={handleBookedDayStyle}
                    onActiveStartDateChange={handlePreviousOrNext}
                    tileDisabled={handleDisabledDays}
                />
            </label>}

            {paath &&
            <label style={interact}>
                Start Date
                <input 
                    name="startDate" 
                    type="date"
                    value={event.startDate}
                    onChange={handleChange}
                />
            </label>}

            {paath && 
            <label style={interactMore}>
                End Date
                <input 
                    name="endDate" 
                    type="date"
                    value={event.endDate}
                    onChange={handleChange}
                />
            </label>}

            <label style={interact}>
                Place Name
                <input 
                    name="place" 
                    value={event.place}
                    onChange={handleChange}
                />
            </label>

            <label style={interact}>
                Address
                <input 
                    name="address" 
                    value={event.address}
                    onChange={handleChange}
                />
            </label>

            <label style={interact}>
                Phone Number
                <input 
                    name="number" 
                    value={event.number}
                    onChange={handleChange}
                />
            </label>
                
            <button className='create-button'>Create</button>
        </form>
            
    )
}

export default NewEvent;