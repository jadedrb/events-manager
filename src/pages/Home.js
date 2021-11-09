import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import '../styles/home.css'

const Home = () => {
  let paaths = useSelector((state) => state.events.events.filter((e) => e.type === "paath"));
  let [dropdown, setDropdown] = useState(false)
  let history = useHistory()
  console.log(paaths);

  const handlePaathClick = (e) => {
    history.push(`/events/${e.target.id}`)
}

  return (
    <main>
      <section className="hero">
        <h2>Book or create an event at your nearest Gurdwara Sahib!</h2>
        <form>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
          />
          <button>
            <Link to="/sign-up">
              <label htmlFor="email">Sign Up for Free!</label>
            </Link>
          </button>
        </form>
      </section>
      <section className="services-breakdown">
        <div>

        {/* 
          Turned Book A Slot link into a Bootstrap dropdown
          Resource: https://getbootstrap.com/docs/4.0/components/dropdowns/
        */}
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={() => setDropdown(!dropdown)} 
            >
              Book A Slot
            </button>
            {dropdown && 
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {paaths.map(e => <p key={e.id} id={e.id} onClick={handlePaathClick}>{e.place}</p>)}
            </div>}
          </div>

          <button>
            <Link to="/new-event">Create an Event</Link>
          </button>
          <button>
            <Link to="/sign-up">Manage Events</Link>
          </button>
        </div>
        <img src="#" alt="home page example" />
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
  );
};

export default Home;
