#include <Arduino.h>

#include "functions.h"
#include "SparkFunHTU21D.h"

HTU21D sensor;
float tempC;
float tempF;

void setup() {
  Serial.begin(115200);
  Serial.println();
  // setup_wifi();
  // setup_mqtt();
  sensor.begin();
}

void loop() {
  // if(!client.connected()) {
  //   reconnect();
  // }
  // client.loop();
  // client.subscribe("bbq/client");
  tempC = sensor.readTemperature();
  tempF = tempC * 9.0 / 5.0 + 32.0;
  Serial.println(tempF);
  Serial.println(sensor1.readFarenheit());
  delay(2000);
}
