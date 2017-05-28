[![Build Status](https://travis-ci.org/mdwagner/bbq-arduino-ionic.svg?branch=develop)](https://travis-ci.org/mdwagner/bbq-arduino-ionic)
# bbq-arduino-ionic
An Ionic 2 app that communicates with an Arduino board via MQTT, to monitor the temperature on a charcoal grill and adjust with fans.

# Ionic 2.x
## Installation
1. Install Node >= 6.x
2. Install Cordova & Ionic CLI
   * `npm install -g cordova@6.5.0 ionic@2.2.0 `
3. `npm install`

## Configure MQTT
1. Inside `src/app/app.module.ts`, configure the settings to your own MQTT service
```js
export function mqttServiceFactory() {
  return new MqttService({
    hostname: '<HOSTNAME>',
    port: <PORT>,
    protocol: 'wss',
    clientId: "client-" + Date.now(),
    username: '<USERNAME>',
    password: '<PASSWORD>'
  });
}
```

## Run in web browser
1. `npm run ionic:serve`

## Run on emulator
1. `npm run ionic:build`
2. `ionic platform add android` OR `ionic platform add ios`
3. `ionic emulate android` OR `ionic emulate ios`
