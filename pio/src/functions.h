#include <PubSubClient.h>
#include "Adafruit_MAX31855.h"

extern PubSubClient client;
extern Adafruit_MAX31855 sensor1;

struct Configs {
  int grillTemp;
  int timeToCheck;
  bool killswitch;
};
typedef struct Configs Configs;
extern Configs config;

void callback(char* topic, byte* payload, unsigned int length);
void setup_mqtt();
void reconnect();
void setup_wifi();
