/* Tested on GMP 6.3.0, Ubuntu 24.04. */

#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#include <time.h>

#include <gmp.h>

static uint64_t get_milis(void) {
    struct timespec ts;
    timespec_get(&ts, TIME_UTC);
    return (uint64_t)(ts.tv_sec * 1000 + ts.tv_nsec/1000000);
}

int main(int argc, char **argv) {
    char *as, *bs;
    mpz_t a, aq, ar, b;
    uint64_t i, time, newtime;

    /* CLI and init. */
    if (argc > 1) {
        as = argv[1];
    } else {
        as = "8";
    }
    if (argc > 2) {
        bs = argv[2];
    } else {
        bs = "0";
    }
    mpz_init_set_str(a, as, 10);
    mpz_init_set_str(b, bs, 10);
    mpz_init(aq);
    mpz_init(ar);
    i = 0;
    time = get_milis();

    /* Run. */
    while (1) {
        /* aq = a / 2
         * ar = a % 2 */
        mpz_fdiv_qr_ui(aq, ar, a, 2);
        if (
            /* odd */
            mpz_cmp_ui(ar, 0)
        ) {
            /* b == 0 */
            if (!mpz_cmp_ui(b, 0)) break;
            /* a = aq * 3 + 1 */
            mpz_mul_ui(a, aq, 3);
            mpz_add_ui(a, a, 1);
            /* b -= 1 */
            mpz_sub_ui(b, b, 1);
        } else {
            /* a = aq * 3 */
            mpz_mul_ui(a, aq, 3);
            /* b += 2 */
            mpz_add_ui(b, b, 2);
        }
        i++;
        if (i % 100000 == 0) {
            newtime = get_milis();
            gmp_printf("%" PRIu64 " ms=%" PRIu64 " log10(a)=%ju log10(b)=%ju\n",
                       i/100000, newtime - time, mpz_sizeinbase(a, 10), mpz_sizeinbase(b, 10));
            time = newtime;
        }
    }

    /* Cleanup if we ever reach it. */
    mpz_clear(a);
    mpz_clear(aq);
    mpz_clear(ar);
    mpz_clear(b);
    return 0;
}
