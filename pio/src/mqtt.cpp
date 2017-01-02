#include "Arduino.h"
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

const int BUFFER_SIZE = JSON_OBJECT_SIZE(2) + JSON_ARRAY_SIZE(0);
StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;
const char* temp;

void callback(char* topic, byte* payload, unsigned int length) {
  byte* payloadCopy = (byte*)malloc(length);
  memcpy(payloadCopy,payload,length);
  char inData[length];
  // Serial.print("inData:");
  for(int i=0; i<length; i++) {
    inData[i] = (char)payloadCopy[i];
  }
  // Serial.println(inData);
  
  // JsonObject& config = jsonBuffer.parseObject(inData);
  // if(config.containsKey("desired-temp")) {
  //   if(config["desired-temp"].is<char*>()) {
  //     temp = config["desired-temp"];
  //   } else {
  //     temp = "invalid type";
  //   }
  // } else {
  //   temp = "invalid key";
  // }
  // Serial.println(temp);
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
