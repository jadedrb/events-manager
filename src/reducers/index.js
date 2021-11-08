import { combineReducers } from 'redux';

import eventReducer from './eventReducer';
import userReducer from './userReducer';
import slotReducer from './slotReducer';

const rootReducer = combineReducers({
    events: eventReducer,
    slots: slotReducer,
    users: userReducer                             
})

export default rootReducer;