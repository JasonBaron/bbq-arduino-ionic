interface State {
  grillDesiredTemperature: number;
  grillCurrentTemperature: number;
  grillHideProgressbar: boolean;

  meatDesiredTemperature: number;
  meatCurrentTemperature: number;
  meatHideProgressbar: boolean;

  timeToCheck: number;
  status: boolean;
}

export const defaultState: State = {
  grillDesiredTemperature: 0,
  grillCurrentTemperature: 0,
  grillHideProgressbar: true,

  meatDesiredTemperature: 0,
  meatCurrentTemperature: 0,
  meatHideProgressbar: true,

  timeToCheck: 5,
  status: false,
};

export default State;