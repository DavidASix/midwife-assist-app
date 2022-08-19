import {combineReducers} from 'redux';

import settings from './SettingsReducer';
import auth from './AuthReducer';
import client from './ClientReducer';
import notes from './NotesReducer';

// take all of the reducers and combine them into 1 reducer object which will be used by store (see ~/src/config/store.js for further doc)
// each reducer name corrosponds to the reducer import above. So if I wanted to access the user's userId, it would be in auth.userId
const reducers = combineReducers({
  settings,
  auth,
  client,
  notes,
});

export default reducers;
