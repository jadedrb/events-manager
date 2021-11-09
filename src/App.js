import React, { useEffect } from 'react';
import './App.css';

// import NavBar from './components/NavBar';
import Home from './pages/Home';
import Events from './pages/Events';
import NewEvent from './pages/NewEvent';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'

import { setEvent } from './actions/actions'
import NavBarTest from './components/NavBarTest';
import Footer from './components/Footer';
import Paath from './pages/Paath';

function App() {

    let dispatch = useDispatch()
    let events = useSelector(state => state.events.events)

    useEffect(() => {
        // pretend backend
        let currentStorage = localStorage.getItem("events")
        if (currentStorage) {
            let parsedStorage = JSON.parse(currentStorage)
            console.log(parsedStorage)
            dispatch(setEvent(parsedStorage))
        }
    }, [dispatch]) // Only adding this because it was complaining without it. Still a ComponentDidMount

    return (
        <Router>
            {/* <NavBar/> */}
            <NavBarTest />
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/events" component={Events} />
                <Route path="/events/:id" component={Paath} />
                <Route path="/new-event" render={() => <NewEvent events={events} />} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;
