#include <Arduino.h>
#include "functions.h"
#include <Wire.h>
#include "OLED.h"

#define addr 0x3c
#define sda 0 //D3
#define scl 2 //D4

OLED display(sda, scl);

void init_display() {
    display.begin();
}
void setup_display(char* msg) {
// Initialize display
  display.print((char*)msg, 1);
  delay(3*1000);
}

void temp_display(float meatSensor, float grillSensor) {

  display.print((char*)"Temperatures", 2);
  char temp1[25];
  char arraystr1[25];
  dtostrf(meatSensor, 3, 1, temp1);
  sprintf(arraystr1,"Meat  %s", temp1);
  display.print((char*)arraystr1, 4);
  dtostrf(grillSensor, 3, 1, temp1);
  sprintf(arraystr1,"Grill %s", temp1);
  display.print((char*)arraystr1, 5);
}
