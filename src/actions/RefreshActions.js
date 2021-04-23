import * as types from './ActionTypes';

export const refreshStore = () => dispatch => {
  console.log('refresh store called');
  dispatch({ type: types.REFRESH_STORE })
};
