import * as types from './ActionTypes';

export const refreshStore = () => dispatch => {
  dispatch({ type: types.REFRESH_STORE })
};
