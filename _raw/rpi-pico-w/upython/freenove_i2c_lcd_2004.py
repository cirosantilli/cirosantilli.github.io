# https://github.com/Danielerikrust/LCD-20x4-Feed
# https://github.com/Danielerikrust/LCD-20x4-Feed/blob/CH9121/LCD_Demo.py

import time
from machine import I2C, Pin
from LCD_Display import LcdApi, I2CLcd

"""LCD Section"""
i2c = I2C(0, sda=Pin(20), scl=Pin(21), freq=400000) #GPIO 20 & 21 have no other function but I2C
devices = i2c.scan()
lcd = I2CLcd(i2c, devices[0], 4, 20) #For 4 row x 20 column LCDs
#lcd = I2CLcd(i2c, devices[0], 2, 16) #For 2 row x 16 column LCDs
print(lcd)
# TODO: display turns on, recognizes I2C since lcd[0] variable not blow up, but nothing is showing up...
lcd.topdata("THIS REMAINS STATIC")
time.sleep(1)
lcd.feed("^ These")
time.sleep(1)
lcd.feed("^^ Lines")
time.sleep(1)
lcd.feed("^^^ Feed")
time.sleep(1)
lcd.feed("^^^^ Up")
time.sleep(1)
lcd.feed("as you add new ones")
