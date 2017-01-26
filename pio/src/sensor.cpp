#include <Arduino.h>

#include "functions.h"
#include <SPI.h>
#include <Adafruit_MAX31855.h>

int maxSO =  15;
int maxCS = 13;
int maxSCK = 12;

Adafruit_MAX31855 sensor1(maxSCK, maxCS, maxSO);
