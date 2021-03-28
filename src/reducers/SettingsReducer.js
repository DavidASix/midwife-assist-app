import * as types from '../actions/ActionTypes';

const INITIAL_STATE = {
  theme: 'light',
  firstLogin: true,
};

//Profile Settings
const settings = (state = INITIAL_STATE, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case types.CHANGE_THEME:
      // Set new theme to user selected theme, this will update all parts of the app
      return Object.assign(newState, { theme: action.payload });
    case types.FIRST_LOGIN:
      return Object.assign(newState, { firstLogin: false });
    default: return state;
  }
}

export default settings;
