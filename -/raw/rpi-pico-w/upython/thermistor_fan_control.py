from math import log

from machine import ADC, Pin, PWM, UART
from time import sleep

# Thermistor parameter found on its datasheet.
T_R25 = 10000
T_BETA = 3950
# Resistance of the other fixed resistor of the thermistor voltage divider.
# We select it to match the thermistor at 25%.
T_R_OTHER = 10000
T0 = 273.15
TARGET_C = 29

U16MAX = 2 ** 16 - 1

led = Pin('LED', Pin.OUT)
adc = ADC(Pin(26))
uart0 = UART(0, baudrate=9600, tx=Pin(0), rx=Pin(1))
pwm = PWM(Pin(2))
pwm.freq(1000)
while True:
    v_other_frac = max(adc.read_u16(),1)/(U16MAX + 1)
    # Thermistor resistance
    # R_other = V_other/I = V_other / (5v / (R_other + R_thermistor)) =
    #        V_other (R_other + R_thermistor)) / 5v =>
    # R_thermistor = (R_other * 5v / V_other) - R_other = R_other * (5v/V_other - 1)
    tr = T_R_OTHER  * (1/v_other_frac - 1)
    # Temperature.
    # https://en.wikipedia.org/wiki/Thermistor#B_or_%CE%B2_parameter_equation
    temp_c = 1/(1/(T0 + 25) + (1/T_BETA)*log(tr/T_R25)) - T0
    sleep(0.2)
    led.toggle()
    duty = min(U16MAX, int(U16MAX * max(temp_c - TARGET_C, 0)/5))
    s = 'temp_c={} tr={} duty={}'.format(temp_c, tr, duty)
    print(s)
    uart0.write(s + '\r\n')
    pwm.duty_u16(duty)
