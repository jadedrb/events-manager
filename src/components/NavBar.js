import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {

    return (
        <nav>
            <ul>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/new-event">New Event</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;