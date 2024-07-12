/* Adapted from:
 * https://en.wikipedia.org/w/index.php?title=GNU_Multiple_Precision_Arithmetic_Library&oldid=1213913871
 * Tested on GMP 6.3.0, Ubuntu 24.04.
 */

#include <stdio.h>
#include <gmp.h>

int main(void) {
    mpz_t x, y, result;
    mpz_init_set_str(x, "7612058254738945", 10);
    mpz_init_set_str(y, "9263591128439081", 10);
    mpz_init(result);
    mpz_mul(result, x, y);
    gmp_printf("%Zd * %Zd = %Zd\n", x, y, result);

    /* Cleanup */
    mpz_clear(x);
    mpz_clear(y);
    mpz_clear(result);
    return 0;
}
