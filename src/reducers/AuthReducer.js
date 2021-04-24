import * as types from '../actions/ActionTypes';

const INITIAL_STATE = {
  loggedIn: null,
  userId: null,
  pin: '1234',
  authType: null,
  lastLogTime: 0
};

const auth = (state = INITIAL_STATE, action) => {
  let newState = Object.assign({}, INITIAL_STATE, state);
  switch (action.type) {
    case types.REFRESH_STORE:
      return newState;
    case types.UPDATE_AUTH_TYPE:
      return Object.assign(newState, { authType: action.payload.authType, pin: action.payload.pin });
    case types.LOGIN:
      return Object.assign(newState, { lastLogTime: Date.now() });
    default: return state;
  }
}

export default auth;
