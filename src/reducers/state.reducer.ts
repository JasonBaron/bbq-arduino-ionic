import { ActionReducer, Action } from '@ngrx/store';
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
    case 'SET_GRILL_DESIRED_TEMPERATURE':
      return Object.assign({}, state, {
        grillDesiredTemperature: action.payload
      });

    case 'SET_GRILL_CURRENT_TEMPERATURE':
      return Object.assign({}, state, {
        grillCurrentTemperature: action.payload
      });

    case 'GRILL_HIDE_PROGRESSBAR':
      return Object.assign({}, state, {
        grillHideProgressbar: true
      });

    case 'GRILL_SHOW_PROGRESSBAR':
      return Object.assign({}, state, {
        grillHideProgressbar: false
      });

    case 'SET_MEAT_DESIRED_TEMPERATURE':
      return Object.assign({}, state, {
        meatDesiredTemperature: action.payload
      });

    case 'SET_MEAT_CURRENT_TEMPERATURE':
      return Object.assign({}, state, {
        meatCurrentTemperature: action.payload
      });

    case 'MEAT_HIDE_PROGRESSBAR':
      return Object.assign({}, state, {
        meatHideProgressbar: true
      });

    case 'MEAT_SHOW_PROGRESSBAR':
      return Object.assign({}, state, {
        meatHideProgressbar: false
      });

    case 'SET_GRILL_MEAT_DESIRED_TEMPERATURE':
      return Object.assign({}, state, action.payload);

    case 'SET_GRILL_MEAT_CURRENT_TEMPERATURE':
      return Object.assign({}, state, action.payload);

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