// Action types are constants used to connection redux actions to redux reducers
// We use action types to have a clear list of the connections between actions and reducers, and to make any spelling mistakes between connecting the two are obvious

// Auth
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const UPDATE_AUTH_TYPE = 'updateAuthType';

// Client
export const STORE_CLIENT = 'storeClient';
export const DELETE_CLIENT = 'deleteClient';
export const UPDATE_CLIENT = 'updateClient';
export const STORE_BABY = 'storeBaby';
export const CHANGE_SORT_TYPE = 'change_sort_type';

//Notes

export const STORE_NOTE = 'storeNote';
export const DELETE_NOTE = 'deleteNote';

//Settings
export const CHANGE_THEME = 'changeTheme';
export const FIRST_LOGIN = 'firstLogin';
