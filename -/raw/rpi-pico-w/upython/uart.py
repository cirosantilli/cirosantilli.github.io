from machine import UART, Pin
import time

led = Pin('LED', Pin.OUT)
uart0 = UART(0, baudrate=9600, tx=Pin(0), rx=Pin(1))
#uart1 = UART(1, baudrate=9600, tx=Pin(4), rx=Pin(5))
i = 0
while (True):
    led.toggle()
    uart0.write(str(i) + '\r\n')
    print(-i)
    time.sleep(.5)
    i += 1
