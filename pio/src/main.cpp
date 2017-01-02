#include <Arduino.h>
#include <ArduinoJson.h>
#include "functions.h"
#include "SparkFunHTU21D.h"
#include <TimeLib.h>

#define out_topic "sensor/grill"
#define test_topic "test"

HTU21D sensor;
float tempC;
float tempF;

const int BUFFER_SIZE = JSON_OBJECT_SIZE(2) + JSON_ARRAY_SIZE(0);

void setup() {
  Serial.begin(115200);
  Serial.println();
  setup_wifi();
  setup_mqtt();
  sensor.begin();
}

void loop() {
  if(!client.connected()) {
    reconnect();
  }

  tempC = sensor.readTemperature(); // Blynk on-board sensor
  time_t timeTaken = now();
  tempF = tempC * 9.0 / 5.0 + 32.0;
  // tempF = sensor1.readFarenheit(); // Adafruit MAX31855
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer2;
  JsonObject& object = jsonBuffer2.createObject();
  object["temp"] = tempF;
  object["time"] = timeTaken;
  size_t objLen = object.measureLength();
  size_t objSize = objLen + 1;
  char jsonPayload[objSize]; // Temperature json payload buffer
  object.printTo(jsonPayload, objSize);
  if(!client.publish(test_topic, jsonPayload, objLen)) {
    Serial.print("Failed to publish: ");
    Serial.print(jsonPayload);
    Serial.print(" to ");
    Serial.println(test_topic);
  }
  client.loop();
  delay(2000);
}
