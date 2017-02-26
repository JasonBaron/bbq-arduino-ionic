#include <Arduino.h>
#include <ArduinoJson.h>
#include "functions.h"
#include <TimeLib.h>

#define out_topic "sensor/grill"
#define test_topic "test"
#define fan_pin 15

float sensorGrillF;
float sensorMeatF;
long previousTime = 0;

const int BUFFER_SIZE = JSON_OBJECT_SIZE(3) + JSON_ARRAY_SIZE(0);
void send(float meatSensor, float grillSensor, long timeRecorded);

void setup() {
  Serial.begin(115200);
  Serial.println();
  setup_display();
  setup_wifi();
  setup_mqtt();
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
        sensorGrillF = grillSensor.readFarenheit(); // Adafruit MAX31855 grill
        sensorMeatF = meatSensor.readFarenheit(); // Adafruit MAX31855 meat
        long timeTaken = now();
        send(sensorMeatF, sensorGrillF, timeTaken);

        if(sensorGrillF <= config.grillTemp) {
          float diff = config.grillTemp - sensorGrillF;
          if(diff >= 0 && diff < 5) {
            analogWrite(fan_pin, 0); // 0%
          } else if(diff >= 5 && diff < 10) {
            analogWrite(fan_pin, 204); // 20%
          } else if(diff >= 10 && diff < 15) {
            analogWrite(fan_pin, 409); // 40%
          } else if(diff >= 15 && diff < 20) {
            analogWrite(fan_pin, 613); // 60%
          } else if(diff >= 20 && diff < 25) {
            analogWrite(fan_pin, 818); // 80%
          } else if(diff >= 25) {
            analogWrite(fan_pin, 1023); // 100%
          }
        } else {
          Serial.println("Grill is done!");
          analogWrite(fan_pin, 0); // 0%
        }

        if(sensorMeatF >= config.meatTemp) {
          Serial.println("Meat is done!");
          config.killswitch = true;
        }
      } else {
        analogWrite(fan_pin, 0); // 0%; Turn fan off if running
      }
    }
  }
}

// Sensors must be in farenheit
void send(float meatSensor, float grillSensor, long timeRecorded) {
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer2;
  JsonObject& object = jsonBuffer2.createObject();
  if(isnan(meatSensor)) {
    meatSensor = 0;
  }
  if(isnan(grillSensor)) {
    grillSensor = 0;
  }
  object["meatTempRecorded"] = meatSensor;
  object["grillTempRecorded"] = grillSensor;
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
