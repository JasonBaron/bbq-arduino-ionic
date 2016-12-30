#include "Arduino.h"
#include <ArduinoJson.h>
#include "functions.h"
#include <PubSubClient.h>
#include <ESP8266WiFi.h>

#define mqtt_server "m13.cloudmqtt.com"
#define mqtt_user "exutmxno"
#define mqtt_password "iJL7QBChkK75"

#define out_topic "sensor/temperature"
#define in_topic "bbq/client"

void callback(char* topic, byte* payload, unsigned int length);
void setup_mqtt();
void reconnect();

WiFiClient espClient;
PubSubClient client(espClient);
StaticJsonBuffer<200> jsonBuffer;
const char* name;

void callback(char* topic, byte* payload, unsigned int length) {
  char inData[length];
  Serial.print("payload: ");
  for(int i=0; i<length; i++) {
    inData[i] = (char)payload[i];
  }
  JsonObject& root = jsonBuffer.parseObject(inData);
  name = root["value"];
  Serial.println(name);
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
