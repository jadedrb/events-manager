import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main>
            {/* Home Page
            <button
                id="flush"
                onClick={() => { localStorage.clear(); alert('Local Storage cleared.') }}
                style={{ padding: "10px", cursor: "pointer" }}
            >
                Clear Local Storage
            </button> */}
            <section className="hero">
                <h2>Book or create an event at your nearest Gurdwara Sahib!</h2>
                <form>
                    <input type="email" id="email" name="email" placeholder="Enter email address" />
                    <button><Link to="/sign-up"><label htmlFor="email">Sign Up for Free!</label></Link></button>
                </form>
            </section>
            <section className="services-breakdown">
                <div>
                    <button><Link to="/sign-up">Book a Slot</Link></button>
                    <button><Link to="/sign-up">Create an Event</Link></button>
                    <button><Link to="/sign-up">Manage Events</Link></button>
                </div>
                <img src="#" alt="home page example"/>
            </section>
            <section>
                <div>
                    <h2>Get Started</h2>
                    <p>Discover Gurdwara Sahib events near you!</p>
                    <div>
                        <button>Log In</button>
                        <button>Sign Up</button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home;