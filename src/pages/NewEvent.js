import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { v4 as uuid } from 'uuid'
import Cookies from 'js-cookie'

import { addEvent } from '../actions/actions';

const NewEvent = () => {

    let dispatch = useDispatch()
    let history = useHistory()

    let [event, setEvent] = useState({
        startDate: '',
        endDate: '',
        place: '',
        address: ''
    })

    const handleChange = (e) => {
        let { name, value } = e.target
        setEvent({ ...event, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(event)

        // create a user cookie 
        let userCookie = Cookies.get("events-user")
        
        if(!userCookie) {
            Cookies.set("events-user", uuid(), { expires: 1 })
            userCookie = Cookies.get("events-user")
        }

        let newEvent = {
            ...event,
            id: uuid(),
            userId: userCookie
        }
        history.push('/events')
        dispatch(addEvent(newEvent))

       

        console.log(userCookie, 'userCookie')
        

        // pretend backend
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

    return (
        <form className="ne-form" onSubmit={handleSubmit}>
            <label>
                Start Date
                <input 
                    name="startDate" 
                    type="date"
                    onChange={handleChange}
                />
            </label>

            <label>
                End Date
                <input 
                    name="endDate" 
                    type="date"
                    onChange={handleChange}
                />
            </label>

            <label>
                Place Name
                <input 
                    name="place" 
                    onChange={handleChange}
                />
            </label>

            <label>
                Address
                <input 
                    name="address" 
                    onChange={handleChange}
                />
            </label>

            <button>Create</button>
        </form>
    )
}

export default NewEvent;