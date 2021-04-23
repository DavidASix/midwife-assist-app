import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import reducers from '../reducers';

/*
  Store contains all data stored from Redux, to be accessed later in the app.
  The Reducers are taken, then added to a persistant reducer. Anything in the pReducer is save on the device if the app is closed, or phone is restarted. This way we cut down on server calls and can store user data instead of grabbing it every time it's used.
  In the store we then intergrate thunk, which allows us to perform more complex actions including async actions when redux actions are called.
  https://www.youtube.com/watch?v=3sjMRS1gJys&list=PL-AXPOKKjw67UUC5aDACXUiwtXNuLu1tn&index=3&t=0s    -- STEVIE G
  https://www.youtube.com/watch?v=1w-oQ-i1XB8&list=PL-AXPOKKjw67UUC5aDACXUiwtXNuLu1tn&index=2&t=0s  -- great how does redux work
  https://redux.js.org/
  https://github.com/reduxjs/redux-thunk
  https://github.com/rt2zz/redux-persist
*/

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: []
};

// persisted reducers
const pReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  pReducer,
  {},
  applyMiddleware(thunk)
);

export const persistor = persistStore(store);
// purge persisted data on reload
//persistor.purge();
