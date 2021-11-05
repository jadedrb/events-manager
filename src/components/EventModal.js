import React from 'react';
import Modal from './Modal'

const EventModal = ({ toggleDetails }) => {
    return ( 
        <Modal>
            <div className='event-modal'>
                <div>Time Slots</div>
            </div>
            <div className='event-modal-cloud' onClick={toggleDetails}></div>
        </Modal>
    );
}
 
export default EventModal;