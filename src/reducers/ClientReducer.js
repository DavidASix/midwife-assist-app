import * as types from '../actions/ActionTypes';
const c = require('../assets/constants');

/*
this.sortingOptions = [
  { value: 'Last Name', slug: 'lastAlpha' },
  { value: 'EDD 👇', slug: 'eddAsc' },
  { value: 'EDD ☝', slug: 'eddDsc' },
];
*/
const INITIAL_STATE = {
  clients: [], //[], //c.clients
  babies: [],
  sortType: 'lastAlpha'
};

const notes = (state = INITIAL_STATE, action) => {
  let newState = Object.assign({}, INITIAL_STATE, state);
  switch (action.type) {
    case types.REFRESH_STORE:
      return newState;
    case types.STORE_CLIENT:
      return Object.assign(newState, { clients: [...newState.clients, action.payload] });
    case types.DELETE_CLIENT:
      return Object.assign(newState, { clients: newState.clients.filter((client, i) => client.id !== action.payload) });
    case types.UPDATE_CLIENT:
      return Object.assign(newState, { clients: [
        ...newState.clients.filter((client, i) => client.id !== action.payload.id),
        action.payload ] });
    case types.STORE_BABY:
      return Object.assign(newState,  { babies: [...newState.babies, action.payload] });
  case types.CHANGE_SORT_TYPE:
    return Object.assign(newState,  { sortType: action.payload });
    default: return state;
  }
}

export default notes;
