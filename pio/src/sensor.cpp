#include <Arduino.h>

#include "functions.h"
#include <SPI.h>
#include <Adafruit_MAX31855.h>

int maxSO = 15;
int maxCS = 13;
int maxSCK = 12;

int maxSO2 = 15;
int maxCS2 = 13;
int maxSCK2 = 12;

Adafruit_MAX31855 grillSensor(maxSCK, maxCS, maxSO);
Adafruit_MAX31855 meatSensor(maxSCK2, maxCS2, maxSO2);
