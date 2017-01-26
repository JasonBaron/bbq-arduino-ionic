#include <Arduino.h>
#include <ArduinoJson.h>
#include "functions.h"
#include <SparkFunHTU21D.h>
#include <TimeLib.h>

#define out_topic "sensor/grill"
#define test_topic "test"
#define fan_pin 15

HTU21D sensor;
float sensorTempC;
float sensorTempF;
long previousTime = 0;

const int BUFFER_SIZE = JSON_OBJECT_SIZE(3) + JSON_ARRAY_SIZE(0);
void send(float grillSensor, float meatSensor, long timeRecorded);

void setup() {
  Serial.begin(115200);
  Serial.println();
  setup_wifi();
  setup_mqtt();
  sensor.begin();
  pinMode(fan_pin, OUTPUT);
}

void loop() {
  if(!client.connected()) {
    reconnect();
  }
  client.loop();
  unsigned long currentTime = millis();
  if(currentTime - previousTime > (config.timeToCheck * 1000)) {
    previousTime = currentTime;
    if(timeStatus() == timeSet) {
      if(!config.killswitch) {
        sensorTempC = sensor.readTemperature(); // Blynk on-board sensor
        // tempF = sensor1.readFarenheit(); // Adafruit MAX31855
        long timeTaken = now();
        sensorTempF = sensorTempC * 9.0 / 5.0 + 32.0;
        send(sensorTempF, 0, timeTaken);

        if(sensorTempF <= config.grillTemp) {
          float diff = config.grillTemp - sensorTempF;
          if(diff >= 0 && diff < 5) {
            analogWrite(fan_pin, 0); // 0%
          } else if(diff >= 5 && diff < 10) {
            analogWrite(fan_pin, 51); // 20%
          } else if(diff >= 10 && diff < 15) {
            analogWrite(fan_pin, 102); // 40%
          } else if(diff >= 15 && diff < 20) {
            analogWrite(fan_pin, 153); // 60%
          } else if(diff >= 20 && diff < 25) {
            analogWrite(fan_pin, 204); // 80%
          } else if(diff >= 25) {
            analogWrite(fan_pin, 255); // 100%
          }
        } else {
          Serial.println("Grill is done!");
          analogWrite(fan_pin, 0); // 0%
          config.killswitch = true;
        }
      }
    }
  }
}

/*
 * Sensors must be in farenheit
 */
void send(float grillSensor, float meatSensor, long timeRecorded) {
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer2;
  JsonObject& object = jsonBuffer2.createObject();
  object["grillTempRecorded"] = grillSensor;
  object["meatTempRecorded"] = meatSensor;
  object["timeRecorded"] = timeRecorded;
  size_t objLen = object.measureLength();
  size_t objSize = objLen + 1;
  char jsonPayload[objSize];
  object.printTo(jsonPayload, objSize);
  if(!client.publish(test_topic, jsonPayload, objLen)) {
    Serial.print("Failed to publish: ");
    Serial.print(jsonPayload);
    Serial.print(" to ");
    Serial.println(test_topic);
  }
}
