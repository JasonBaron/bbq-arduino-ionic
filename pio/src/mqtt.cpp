#include <Arduino.h>
#include <ArduinoJson.h>
#include "functions.h"
#include <PubSubClient.h>
#include <ESP8266WiFi.h>

#define mqtt_server "m13.cloudmqtt.com"
#define mqtt_user "arduino"
#define mqtt_password "4GnCC5Vd33qs"

#define in_topic "client/config"
#define test_topic "test"

WiFiClient espClient;
PubSubClient client(espClient);
Configs config = { 0, 0, 5, true };

const int BUFFER_SIZE = JSON_OBJECT_SIZE(4) + JSON_ARRAY_SIZE(0);

void callback(char* topic, byte* payload, unsigned int length) {
  byte* payloadCopy = (byte*)malloc(length);
  memcpy(payloadCopy,payload,length);
  char inData[length];
  for(int i=0; i<length; i++) {
    inData[i] = (char)payloadCopy[i];
  }
  if(strcmp(topic, test_topic) == 0) {
    StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;
    JsonObject& jsonConfig = jsonBuffer.parseObject(inData);
    if(jsonConfig.containsKey("grillTemp")) {
      if(jsonConfig["grillTemp"].is<int>()) {
        config.grillTemp = jsonConfig.get<unsigned int>("grillTemp");
      }
    }
    if(jsonConfig.containsKey("meatTemp")) {
      if(jsonConfig["meatTemp"].is<int>()) {
        config.meatTemp = jsonConfig.get<unsigned int>("meatTemp");
      }
    }
    if(jsonConfig.containsKey("timeToCheck")) {
      if(jsonConfig["timeToCheck"].is<int>()) {
        config.timeToCheck = jsonConfig.get<signed int>("timeToCheck");
      } else {
        config.timeToCheck = 5;
      }
    }
    if(jsonConfig.containsKey("killswitch")) {
      if(jsonConfig["killswitch"].is<bool>()) {
        config.killswitch = jsonConfig.get<bool>("killswitch");
      }
    }
  }
  free(payloadCopy);
}

void setup_mqtt() {
  client.setServer(mqtt_server, 17347);
  client.setCallback(callback);
}

void reconnect() {
  while(!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if(client.connect("ESP8266Client", mqtt_user, mqtt_password)) {
      Serial.println("Connected");
      client.subscribe(test_topic);
    } else {
      Serial.print("Failed, RC=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
