import * as types from './ActionTypes';

// Called when user changes their theme, and is passed theme as a string ('light' or 'dark')
// Themes in the app are controlled by the redux store, so this will update any reference to current theme with the new value
export const changeTheme = theme => dispatch => {
  dispatch({type: types.CHANGE_THEME, payload: theme});
};

export const markFirstLogin = () => dispatch => {
  dispatch({type: types.FIRST_LOGIN});
};
