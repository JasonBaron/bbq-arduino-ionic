#include <Arduino.h>
#include "functions.h"
#include <Wire.h>
#include "SSD1306.h"

#define addr 0x3c
#define sda 0
#define scl 2

SSD1306 display(addr, sda, scl);

void setup_display() {
  // Initialising the UI will init the display too.
  display.init();
  display.flipScreenVertically();
  display.setFont(ArialMT_Plain_16);
}
