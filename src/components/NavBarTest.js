import React from 'react';
import { Link } from 'react-router-dom';

const NavBarTest = () => {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light ">
            <h1 class="navbar-brand" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
                Event Management Tool
            </h1>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <Link to="/" class="nav-link">Home</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/events" class="nav-link">Events</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/new-event" class="nav-link">New Event</Link>
                    </li>
                </ul>
            </div>
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Sign Up</button>
        </nav>


    )
}

export default NavBarTest
