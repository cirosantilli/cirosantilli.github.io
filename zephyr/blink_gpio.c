/* Tested on: RPI Pico W */

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>

#define GPIO_PIN_NUM 0

int main(void)
{
    const struct device *gpio_dev = DEVICE_DT_GET(DT_NODELABEL(gpio0));
    if (!device_is_ready(gpio_dev)) {
        return 1;
    }
    if (gpio_pin_configure(gpio_dev, GPIO_PIN_NUM, GPIO_OUTPUT | GPIO_ACTIVE_LOW) != 0) {
        return 1;
    }
    while (1) {
        gpio_pin_toggle(gpio_dev, GPIO_PIN_NUM);
        k_sleep(K_MSEC(500));
    }
    return 0;
}
