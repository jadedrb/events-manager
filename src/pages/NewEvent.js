import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { v4 as uuid } from 'uuid'

import { addEvent } from '../actions/actions';

const NewEvent = (props) => {

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
        availDays: [],
        availMonths: []
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

            let availDays = []
            let thisYear = currentYear() === event.langarDate.yy
            let thisMonth = currentMonth() === event.langarDate.mm && thisYear
            let startDay = thisMonth ? new Date().getDay() : 1

            let availMonthObj = {}
            let dayWasAlreadyTaken = []

            // Find days that have aleady been taken. 
            for (let i = 0; i < props.events.length; i++) {

                let curr = props.events[i]

                if (!curr.langarDate) continue

                let { mm, yy, dd } = curr.langarDate

                // Handle days in other months
                if (mm in availMonthObj) availMonthObj[mm].push(dd)
                else {
                    
                    availMonthObj[mm] = [dd]
                    console.log(yy, availMonthObj[mm])
                }

                // Handle days in current month
                if (mm === event.langarDate.mm && 
                    yy === event.langarDate.yy) {
                    dayWasAlreadyTaken.push(dd)
                }
    
            }

            let totalDaysInCurrMon = calcDaysInMonth(event.langarDate.yy, event.langarDate.mm)

            // Make an array of available days based off taken days. Will be used for determining selectability
            for (let i = startDay; i <= totalDaysInCurrMon; i++) {
                if (dayWasAlreadyTaken.includes(String(i))) continue
                availDays.push(i)
            }

            let availMonths = []

            // Determine available months
            for (let i = 1; i < 13; i++) {
        
                let currMon = String(i) === currentMonth()
                let currYear = event.langarDate.yy === currentYear()

                // skip any months prior to current
                if (currYear && i < Number(currentMonth())) continue

                // skip current month if no available days taking into account the offset of days passed
                if (currYear && currMon && availMonthObj[i] && availMonthObj[i].length >= totalDaysInCurrMon - Number(currentDay())) continue

                // skip any other months if all days taken
                if (availMonthObj[i] && availMonthObj[i].length >= calcDaysInMonth(event.langarDate.yy, i)) continue

                // otherwise add month to available months
                availMonths.push(i)
            }

            setEvent(prevEvent => ({ 
                ...prevEvent, 
                availDays, 
                availMonths, 
                langarDate: { ...prevEvent.langarDate, dd: String(availDays[0]), mm: availMonths.includes(Number(prevEvent.langarDate.mm)) ? prevEvent.langarDate.mm : String(availMonths[0]) }
            }))
            
        }
    }, [event.type, event.langarDate.mm, event.langarDate.yy, props.events])

    // Utility functions... maybe to be put in a separate file and exported
    const calcDaysInMonth = (year, month) => new Date(year, month, 0).getDate()
    const currentYear = () => String(new Date().getFullYear())
    const currentMonth = () => String(new Date().getMonth() + 1)
    const currentDay = () => String(new Date().getDay())
    const createMonthArr = (initial, cutoffPoint) => [...Array(initial).keys()].slice(cutoffPoint)
    const calcNextYear = () => Number(currentYear()) + 1

    const handleChange = (e) => {
        let { name, value } = e.target

        if (name.includes("langarDate")) {
            let split = name.split("-")
            let dmy = split[1]
            setEvent({ ...event, langarDate: { ...event.langarDate, [dmy]: value }})
            return
        }

        setEvent({ ...event, [name]: value})
    }

    const packageEvent = () => {
        let newEvent;
        let baseEvent = { user, id: uuid(), place: event.place, type: event.type }

        if (event.type === "langar") {
            newEvent = {
                ...baseEvent,
                langarDate: event.langarDate,
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
            
                1. Get pretend backend 
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

    const renderDays = () => {
        // Get an array of days for the current month
        let daysInMonth = calcDaysInMonth(event.langarDate.yy, event.langarDate.mm) + 1
        let days = createMonthArr(daysInMonth, 1)
        let options = days.map(d => <option value={d} key={d} disabled={!event.availDays.includes(d)}>{d}</option>)
        return options
    }

    const renderMonths = () => {
        let months = createMonthArr(13, 1)
        let options = months.map(m => <option value={m} key={m} disabled={!event.availMonths.includes(m)}>{m}</option>)
        return options
    }

    renderDays()

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
                <div>
                    <select value={event.langarDate.mm} name="langarDate-mm" onChange={handleChange}>
                        {renderMonths()}
                    </select>
                    /
                    <select value={event.langarDate.dd} name="langarDate-dd" onChange={handleChange}>
                        {renderDays()}
                    </select>
                    /
                    <select value={event.langarDate.yy} name="langarDate-yy" onChange={handleChange}>
                        <option value={currentYear()}>{currentYear()}</option>
                        <option value={calcNextYear()}>{calcNextYear()}</option>
                    </select>
                </div>
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

            {paath &&
            <label style={interact}>
                Address
                <input 
                    name="address" 
                    value={event.address}
                    onChange={handleChange}
                />
            </label>}

            {!paath &&
            <label style={interact}>
                Phone Number
                <input 
                    name="number" 
                    value={event.number}
                    onChange={handleChange}
                />
            </label>}

            <button>Create</button>
        </form>
    )
}

export default NewEvent;