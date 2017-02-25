#include <Arduino.h>

#include "functions.h"
#include <SPI.h>
#include <Adafruit_MAX31855.h>

int maxSO = 4;
int maxCS = 5;
int maxSCK = 16;

int maxSO2 = 13;
int maxCS2 = 12;
int maxSCK2 = 14;

Adafruit_MAX31855 grillSensor(maxSCK, maxCS, maxSO);
Adafruit_MAX31855 meatSensor(maxSCK2, maxCS2, maxSO2);
