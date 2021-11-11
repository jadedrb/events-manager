import React, { useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { v4 as uuid } from 'uuid'

import { addEvent } from '../actions/actions';

// import { addWeeks } from 'date-fns'

import Calendar from 'react-calendar';

import '../styles/calendar.css'
import '../styles/newEvent.css';

const NewEvent = (props) => {

    let [calendar, setCalendar] = useState(new Date())

    let dispatch = useDispatch()
    let history = useHistory()
    let detailsRef = useRef()

    let user = useSelector(state => state.users.currentUser)

    let [event, setEvent] = useState({
        user: user,
        type: '',
        startDate: '',
        endDate: '',
        place: '',
        address: '',
        langarDate: { dd: '', mm: '', yy: '' },
        bookedDetails: {},
        bookedDays: {},
        selectedDay: { dd: '', mm: '', yy: '' }
    })

    let [phone, setPhone] = useState('')

    useEffect(() => {
        // Determine default dates for Langar type events
        // Using a functional update because otherwise it complains. Besides that nothing different going on here
        console.log({ dd: currentDay(), mm: currentMonth(), yy: currentYear() })
        if (event.type === "langar") {
            setEvent(prevEvent => ({
                ...prevEvent,
                langarDate: formatLangarDate(new Date()),
            }))
        } else {
            setEvent(prevEvent => ({ ...prevEvent, selectedDay: blank(), langarDate: blank() }))
        }

    }, [event.type])

    useEffect(() => {
        setEvent(prevEvent => ({ ...prevEvent, endDate: '' }))
    }, [event.startDate])

    useEffect(() => {
        // Handles filtering of available days and months for langar events when necessary 
        if (event.type === "langar") {

            let bookedDays = {}

            // Find days that have aleady been taken. 
            for (let i = 0; i < props.events.length; i++) {

                let ev = props.events[i]

                if (!ev.langarDate) continue

                let { mm, yy, dd } = ev.langarDate

                // Handle days in event month
                if (mm === event.langarDate.mm &&
                    yy === event.langarDate.yy) {

                    bookedDays[dd] = { dd, ev }
                }

            }

            setEvent(prevEvent => ({
                ...prevEvent,
                bookedDays
            }))

        }
    }, [event.langarDate, event.type, event.langarDate.mm, event.langarDate.yy, props.events])

    // Utility functions... maybe to be put in a separate file and exported
    // const calcDaysInMonth = (year, month) => new Date(year, month, 0).getDate()
    const currentYear = () => String(new Date().getFullYear())
    const currentMonth = () => String(new Date().getMonth() + 1)
    const currentDay = () => String(new Date().getDay())
    // const createMonthArr = (initial, cutoffPoint) => [...Array(initial).keys()].slice(cutoffPoint)
    // const calcNextYear = () => Number(currentYear()) + 1
    // const addAzero = (date) => date < 10 ? '0' + String(date) : date

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

    const blank = () => ({ mm: '', yy: '', dd: '' })

    const handleChange = (e, e2) => {
        let name, value;

        if (e.target) {
            name = e.target.name
            value = e.target.value
        } else {
            // handles selection of a date in the calendar
            let day = e.getDate()
            if (day in event.bookedDays) {
                detailsRef.current.classList.add('active')
                setEvent({ ...event, bookedDetails: event.bookedDays[day], selectedDay: blank() })
                return
            }
            setEvent({ ...event, langarDate: formatLangarDate(e), selectedDay: formatLangarDate(e) })
            return
        }

        setEvent({ ...event, [name]: value })
    }

    const packageEvent = () => {
        let newEvent;
        let baseEvent = { user, id: uuid(), place: event.place, type: event.type }

        if (event.type === "langar") {
            newEvent = {
                ...baseEvent,
                langarDate: event.selectedDay,
                phone
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

        history.push('/')
        alert('Event created!')
        dispatch(addEvent(newEvent))

        /*
            (NOTE: All local storage code below can be deleted. Mostly for development purposes)
            
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

    const handleBookedDayStyle = ({ date }) => {
        let tileDate = String(date.getDate())
        if (tileDate in event.bookedDays)
            return 'booked-day'
        else
            return null
    }

    const handlePreviousOrNext = ({ activeStartDate }) => {
        setEvent({ ...event, langarDate: formatLangarDate(activeStartDate) })
        console.log('next or previous')
    }

    const handlePhone = (e) => {
        let { value } = e.target
        let lstChTypd = value.slice(-1)
        
        if (!/[1-9]/.test(Number(lstChTypd)) && lstChTypd !== '-' && lstChTypd) return
        if (value.length === 13) return

        if (value.length === 4 && !value.includes('-')) {
            value = value.slice(0, 3) + '-' + value.slice(3)
        } else if (value.length === 8 && value[7] !== '-') {
            value = value.slice(0, 7) + '-' + value.slice(7)
        }
        setPhone(value)
    }

    // const weeksFromNow = (n) => {
    //     let dayInFuture = addWeeks(new Date(event.startDate), n)
    //     let mm = dayInFuture.getMonth() + 1
    //     let dd = dayInFuture.getDate()
    //     let yy = dayInFuture.getFullYear()
    //     return `${yy}-${mm}-${dd}`
    // }

    // const handleClickedDetails = () => {
    //     history.push(`/events/${event.bookedDetails.ev.id}`)
    //     dispatch(toggleEventDetails(event.bookedDetails.ev))
    // }

    let greyedOutStyle = {
        opacity: ".1",
        pointerEvents: "none"
    }

    let interact = !event.type ? greyedOutStyle : null
    let buttInt = ((event.type === 'langar' && event.selectedDay.dd) || (event.type === 'paath' && event.startDate && event.endDate)) && event.place && phone && event.address ? null : greyedOutStyle
    let paath = event.type !== "langar"
    let interactMore = (!paath && !event.selectedDay.dd) || (paath && !event.startDate) ? greyedOutStyle : null
    let booked = event.bookedDetails

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
                    />
                    <div
                        className="booked-details"
                        ref={detailsRef}
                        onClick={() => detailsRef.current.classList.remove('active')}
                    >
                        <div><span>{`${booked.ev?.langarDate.mm}/${booked.ev?.langarDate.dd}/${booked.ev?.langarDate.yy}`}</span> has already been booked</div>
                        <div><span>Booked by:</span> {booked.ev?.user}</div>
                        <div><span>Phone number:</span> {booked.ev?.phone}</div>
                        {/* <div onClick={handleClickedDetails}><span>More details</span></div> */}
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
                        min={event.startDate}
                        // max={weeksFromNow(2)}
                        type="date"
                        value={event.endDate}
                        onChange={handleChange}
                        required
                    />
                </label>}

            <label style={interactMore}>
                Place Name
                <input
                    name="place"
                    value={event.place}
                    onChange={handleChange}
                    required
                />
            </label>

            <label style={interactMore}>
                Address
                <input
                    name="address"
                    value={event.address}
                    onChange={handleChange}
                    required
                />
            </label>

            <label style={interactMore}>
                Phone Number
                <input
                    type= "tel"
                    id="number"
                    name="number"
                    value={phone}
                    placeholder="ex: 555-555-5555"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    onChange={handlePhone} 
                    required
                />
            </label>

            <button style={buttInt} className='create-button'>Create</button>
        </form>

    )
}

export default NewEvent;