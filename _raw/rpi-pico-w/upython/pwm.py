# Adapted from: https://projects.raspberrypi.org/en/projects/getting-started-with-the-pico/7

from machine import Pin, PWM
from time import sleep

pwm = PWM(Pin(0))
pwm.freq(1000)
while True:
    for duty in range(65025):
        pwm.duty_u16(duty)
        sleep(0.0001)
    for duty in range(65025, 0, -1):
        pwm.duty_u16(duty)
        sleep(0.0001)
