interface AppState {
  grillDesiredTemperature: number;
  grillCurrentTemperature: number;
  grillHideProgressbar: boolean;

  meatDesiredTemperature: number;
  meatCurrentTemperature: number;
  meatHideProgressbar: boolean;

  timeToCheck: number;
  status: boolean;
}

export default AppState;