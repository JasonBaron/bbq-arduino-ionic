#include "Arduino.h"
#include <ArduinoJson.h>
#include "functions.h"
#include <PubSubClient.h>
#include <ESP8266WiFi.h>

#define mqtt_server "m13.cloudmqtt.com"
#define mqtt_user "arduino"
#define mqtt_password "4GnCC5Vd33qs"

#define in_topic "client/config"

void callback(char* topic, byte* payload, unsigned int length);
void setup_mqtt();
void reconnect();

WiFiClient espClient;
PubSubClient client(espClient);

const int BUFFER_SIZE = JSON_OBJECT_SIZE(1) + JSON_ARRAY_SIZE(0);
StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;
const char* temp;

void callback(char* topic, byte* payload, unsigned int length) {
  char inData[length];
  Serial.print("desired-temp:");
  for(int i=0; i<length; i++) {
    inData[i] = (char)payload[i];
  }
  JsonObject& config = jsonBuffer.parseObject(inData);
  if(config.containsKey("desired-temp")) {
    if(config["desired-temp"].is<char*>()) {
      temp = config["desired-temp"];
    } else {
      temp = "invalid type";
    }
  } else {
    temp = "invalid key";
  }
  Serial.println(temp);
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
    } else {
      Serial.print("Failed, RC=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
