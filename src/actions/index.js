import * as types from '../constants/ActionTypes';

export function echoWorld () {
  return {
    type: types.ECHO_WORLD,
    payload: 'WORLD'
  }
}
