from microbit import *

i = 0
while True:
    print(i)
    display.show(i)
    sleep(500)
    i = i + 1
