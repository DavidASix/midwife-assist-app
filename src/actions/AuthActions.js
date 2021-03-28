import * as types from './ActionTypes';

export const updateAuthType = (authType, pin) => dispatch => dispatch({
  // PIN resets if no pin is given to avoid access remaining  available if someone knows the pin but sec is switched to bio
  type: types.UPDATE_AUTH_TYPE, payload: { authType, pin: pin || '' }
});

//Login is called after a user has logged in, and is passed the userId as a string.
export const login = () => dispatch => dispatch({ type: types.LOGIN });
