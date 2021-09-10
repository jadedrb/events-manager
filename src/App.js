import React, {useEffect} from 'react';
import './App.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Events from './pages/Events';
import NewEvent from './pages/NewEvent';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'

import { setEvent } from './actions/actions'

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
    }, [])

    return (
        <Router>
            <NavBar/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/events" component={Events}/>
                <Route path="/new-event" component={NewEvent}/>
            </Switch>
        </Router>
    );
}

export default App;
