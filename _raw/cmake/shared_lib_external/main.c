#include <stdio.h>
#include <stdlib.h>

#include <gsl/gsl_sf_bessel.h>

int main(void) {
    double x = 5.0;
    printf("J0(%g) = %.18e\n", x, gsl_sf_bessel_J0(x));
    return EXIT_SUCCESS;
}
