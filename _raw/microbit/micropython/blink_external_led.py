from microbit import *

state = 0
while True:
    if state == 0:
        state = 1
    else:
        state = 0
    pin0.write_digital(state)
    display.show(state)
    sleep(500)
