[![Build Status](https://travis-ci.org/mdwagner/bbq-arduino-ionic.svg?branch=develop)](https://travis-ci.org/mdwagner/bbq-arduino-ionic)
# bbq-arduino-ionic
An Ionic 2 app that communicates with an Arduino board via MQTT, to monitor the temperature on a charcoal grill and adjust with fans.

# Ionic 2.x
## Installation
1. Install Node >= 6.x
1. Install Cordova & Ionic CLI
   * `npm install -g cordova@6.5.0 ionic@2.2.0 `
1. `npm install`

## Run in web browser
1. `npm run ionic:serve`

## Run on emulator
1. `npm run ionic:build`
1. `ionic platform add android` OR `ionic platform add ios`
1. `ionic emulate android` OR `ionic emulate ios`
