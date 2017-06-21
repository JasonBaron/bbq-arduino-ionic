import { Action } from '@ngrx/store';
import AppState from '../interfaces';

export const initialState = {
  grillDesiredTemperature: 0,
  grillCurrentTemperature: 0,
  grillHideProgressbar: true,
  meatDesiredTemperature: 0,
  meatCurrentTemperature: 0,
  meatHideProgressbar: true,
  timeToCheck: 5,
  status: false
}

export function stateReducer(state: AppState = initialState, action: Action) {
  switch(action.type) {
    case 'SET_GRILL_MEAT_CURRENT_TEMPERATURE':
      const { grillCurrentTemperature, meatCurrentTemperature } = action.payload;
      return Object.assign({}, state, {
        grillCurrentTemperature,
        meatCurrentTemperature
      });

    case 'SET_GRILL_CONFIG':
      const { grillDesiredTemperature, grillHideProgressbar } = action.payload;
      return Object.assign({}, state, {
        grillDesiredTemperature,
        grillHideProgressbar
      });

    case 'SET_MEAT_CONFIG':
      const { meatDesiredTemperature, meatHideProgressbar } = action.payload;
      return Object.assign({}, state, {
        meatDesiredTemperature,
        meatHideProgressbar
      });

    case 'STATUS_ON':
      return Object.assign({}, state, {
        status: true
      });

    case 'STATUS_OFF':
      return Object.assign({}, state, {
        status: false
      });

    case 'SET_TIME_TO_CHECK':
      return Object.assign({}, state, {
        timeToCheck: action.payload
      });

    case 'RESET_STATE':
      return Object.assign({}, initialState);

    default:
      return state;
  }
}