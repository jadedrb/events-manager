import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { v4 as uuid } from 'uuid'

import { addEvent } from '../actions/actions';

const NewEvent = (props) => {

    let dispatch = useDispatch()
    let history = useHistory()

    let [event, setEvent] = useState({
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
        setEvent({ 
            ...event, 
            langarDate: { dd: String(new Date().getDay()), mm: currentMonth(), yy: currentYear() }, 
            availMonths: [...Array(13).keys()].slice(currentMonth()) 
        })

    }, [])

    useEffect(() => {
        // Handles filtering of available days and months when necessary
        if (event.type === "langar") {

            let availDays = []
            let thisYear = currentYear() === event.langarDate.yy
            let thisMonth = currentMonth() === event.langarDate.mm && thisYear
            let startDay = thisMonth ? new Date().getDay() : 1

            // Find days that have aleady been taken. They must be of the current year and month selected
            // Reduce it into an array of string numbers.
            let dayWasAlreadyTaken = props.events.reduce((acc, curr) => {
                if (curr.langarDate.mm === event.langarDate.mm &&
                    curr.langarDate.yy === event.langarDate.yy) {
                    return [...acc, curr.langarDate.dd]
                }
                return acc
            }, [])

            // Make an array of available days based off taken days. Will be used for determining selectability
            for (let i = startDay; i <= calcDaysInMonth(event.langarDate.yy, event.langarDate.mm); i++) {
                if (dayWasAlreadyTaken.includes(String(i))) continue
                availDays.push(i)
            }

            // Change available months based off year
            let availMonths = thisYear ? [...Array(13).keys()].slice(currentMonth()) : [...Array(13).keys()].slice(1)

            setEvent({ ...event, availDays, availMonths, langarDate: { ...event.langarDate, dd: String(availDays[0]) }})
            
        }
    }, [event.type, event.langarDate.mm, event.langarDate.yy])

    const calcDaysInMonth = (year, month) => new Date(year, month, 0).getDate()

    const currentYear = () => String(new Date().getFullYear())
    const currentMonth = () => String(new Date().getMonth() + 1)

    const calculateNextYear = () => {
        let currentYear = new Date().getFullYear()
        currentYear++
        return String(currentYear)
    }

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
        let baseEvent = { id: uuid(), place: event.place, type: event.type }

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

        console.log(currentStorage)

        let parsedCurrentEvents = JSON.parse(currentStorage)

        let newStorage = [...parsedCurrentEvents, newEvent]
        let stringNewStorage = JSON.stringify(newStorage)

        console.log(newStorage, 'newStorage')
        console.log(stringNewStorage, 'stringNewStorage')

        localStorage.setItem("events", stringNewStorage)
        
    }

    const renderDays = () => {
        // Get an array of days for the current month
        let days = [...Array(calcDaysInMonth(event.langarDate.yy, event.langarDate.mm) + 1).keys()].slice(1)
        let options = days.map(d => <option value={d} key={d} disabled={!event.availDays.includes(d)}>{d}</option>)
        return options
    }

    const renderMonths = () => {
        let months = [...Array(13).keys()].slice(1)
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
                    
                    <select value={event.langarDate.dd} name="langarDate-dd" onChange={handleChange}>
                        {renderDays()}
                    </select>
                    
                    <select value={event.langarDate.yy} name="langarDate-yy" onChange={handleChange}>
                        <option value={currentYear()}>{currentYear()}</option>
                        <option value={calculateNextYear()}>{calculateNextYear()}</option>
                    </select>
                </div>
            </label>}

            {paath &&
            <label style={interact}>
                Start Date
                <input 
                    name="startDate" 
                    type="date"
                    onChange={handleChange}
                />
            </label>}

            {paath &&
            <label style={interact}>
                End Date
                <input 
                    name="endDate" 
                    type="date"
                    onChange={handleChange}
                />
            </label>}

            <label style={interact}>
                Place Name
                <input 
                    name="place" 
                    onChange={handleChange}
                />
            </label>

            {paath &&
            <label style={interact}>
                Address
                <input 
                    name="address" 
                    onChange={handleChange}
                />
            </label>}

            {!paath &&
            <label style={interact}>
                Phone Number
                <input 
                    name="number" 
                    onChange={handleChange}
                />
            </label>}

            <button>Create</button>
        </form>
    )
}

export default NewEvent;