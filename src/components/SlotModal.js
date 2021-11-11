import React, { useRef } from 'react';
import Modal from './Modal';

import { v4 as uuid } from 'uuid'

import { useDispatch } from 'react-redux';
import { addSlot, deleteSlot, updateSlot } from '../actions/slotActions'

import '../styles/slotModal.css'

const SlotModal = ({ slot, closeModal }) => {

    let nameRef = useRef()
    let emailRef = useRef()
    let phoneRef = useRef()

    let dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let newSlot;
        
        if (slot.currentSlot) {
            newSlot = {
                ...slot.currentSlot,
                name: nameRef.current.value,
                email: emailRef.current.value,
                phone: phoneRef.current.value,
            }
        } else {
            newSlot = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                phone: phoneRef.current.value,
                eventId: slot.event.id,
                place: slot.event.place,
                time: slot.time,
                date: slot.date,
                user: slot.event.user,
                id: uuid()
            }
        }

        if (slot.currentSlot)
            localStorageStuff('update', newSlot)
        else
            localStorageStuff('create', newSlot)

        if (slot.currentSlot)
            dispatch(updateSlot(newSlot))
        else 
            dispatch(addSlot(newSlot))

        alert('Slot saved!')
        closeModal(false)
    }

    const localStorageStuff = (type, newSlot) => {
         /*
            Same type of temporary local storage used here as was used
            in the NewEvent component's handleSubmit function
        */

            let currentStorage = localStorage.getItem("slots")

            if (!currentStorage) {
                localStorage.setItem("slots", JSON.stringify([]))
                currentStorage = localStorage.getItem("slots")
            }
    
            let parsedCurrentSlots = JSON.parse(currentStorage)
    
            let newStorage;
        
            if (type === 'update')
                newStorage = parsedCurrentSlots.map(s => s.id === newSlot.id ? newSlot : s)
            else if (type === 'create')
                newStorage = [...parsedCurrentSlots, newSlot]
            else 
                newStorage = parsedCurrentSlots.filter(s => s.id !== slot.currentSlot.id)
    
            let stringNewStorage = JSON.stringify(newStorage)
    
            localStorage.setItem("slots", stringNewStorage)
    }

    const handleDelete = () => {
       localStorageStuff('delete')

        alert('Slot deleted.')
        dispatch(deleteSlot(slot.currentSlot.id))
        closeModal(false)
    }

    return ( 
        <Modal>
            <div className='event-modal'>
                <div className='event-details'>
                    <p className='slot-p'><span>{slot.event.place}</span><span>{slot.date}</span> <span>{slot.time}</span></p>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>
                                Name:
                                <input 
                                    defaultValue={slot.currentSlot?.name}
                                    ref={nameRef} 
                                    required
                                />
                            </label>

                            <label>
                                Email:
                                <input 
                                    type="email"
                                    defaultValue={slot.currentSlot?.email}
                                    ref={emailRef} 
                                    required
                                />
                            </label>

                            <label>
                                Phone:
                                <input 
                                    ref={phoneRef} 
                                    defaultValue={slot.currentSlot?.phone}
                                    type="tel"
                                    placeholder="ex: 555-555-5555"
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    required
                                />
                            </label>
                        </div>

                        <div>
                            <button>{slot.currentSlot ? 'Update' : 'Create'}</button>
                            {slot.currentSlot ? <button type="button" onClick={handleDelete}>Delete</button> : null}
                            <button type="button" onClick={() => closeModal(false)}>Cancel</button>
                        </div>
                    </form>

                </div>
            </div>
            <div className='event-modal-cloud' onClick={() => closeModal(false)}></div>
        </Modal>
    );
}
 
export default SlotModal;