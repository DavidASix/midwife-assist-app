import * as types from './ActionTypes';

//Login is called after a user has logged in, and is passed the userId as a string.
export const storeNewClient = (client) => dispatch => dispatch({ type: types.STORE_CLIENT, payload: client });

// Delete Client is passed a client ID
export const deleteClient = (id) => dispatch => dispatch({ type: types.DELETE_CLIENT, payload: id });

// updateClient is passed a full client object which will replace the existing client
export const updateClient = (updatedClient) => dispatch => dispatch({ type: types.UPDATE_CLIENT, payload: updatedClient });

// Provides baby object which contains the mothers ID
export const storeNewBaby = (baby) => dispatch => dispatch({ type: types.STORE_BABY, payload: baby });

// Changes the sort type of the clients on client page. This is done in Redux to allow for a persistent state on reload.
export const changeSortType = (type) => dispatch => dispatch({ type: types.CHANGE_SORT_TYPE, payload: type });
