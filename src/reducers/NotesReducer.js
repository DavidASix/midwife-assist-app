import * as types from '../actions/ActionTypes';
const c = require('../assets/constants');

const INITIAL_STATE = {
  notes: c.notes, //[], //c.notes
};

const notes = (state = INITIAL_STATE, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case types.STORE_NOTE:
      return Object.assign(newState, { notes: [...newState.notes, action.payload] });
    case types.DELETE_NOTE:
      return Object.assign(newState, { notes: newState.notes.filter((note, i) => note.id !== action.payload) });
    default: return state;
  }
}

export default notes;
