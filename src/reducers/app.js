import Immutable from 'immutable';
import * as types from '../constants/ActionTypes';

export default function app ( state = Immutable.Map(), action = {}) {
  switch (action.type) {
    case types.ECHO_WORLD:
      return state.set('message', action.payload);
    default:
      return state;
  }
}
