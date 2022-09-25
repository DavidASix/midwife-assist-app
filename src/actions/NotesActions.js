import * as types from './ActionTypes';

// called to store a new note with the note schema as:
// {}
export const storeNote = note => dispatch =>
  dispatch({type: types.STORE_NOTE, payload: note});

// Delete Client is passed a client ID
export const deleteNote = id => dispatch =>
  dispatch({type: types.DELETE_NOTE, payload: id});
