#include "Arduino.h"
#include "functions.h"
#include <ESP8266WiFi.h>

#define w_ssid "wagnernet"
#define w_pass "michael1"

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.print(w_ssid);

  WiFi.begin(w_ssid, w_pass);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("WiFi connected with ");
  Serial.println(WiFi.localIP());
}
