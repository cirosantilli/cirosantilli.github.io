#include <stdlib.h>
#include <stdint.h>

int main(int argc, char **argv) {
    uint64_t max, i0, i1, i2, i3;
    if (argc > 1) {
        max = strtoll(argv[1], NULL, 0);
    } else {
        max = 1;
    }
    i0 = 0;
    i1 = 0;
    i2 = 0;
    i3 = 0;
#if defined(__x86_64__) || defined(__i386__)
    __asm__ (
        "start:"
        "inc %[i0];"
        "inc %[i1];"
        "inc %[i2];"
        "inc %[i3];"
        "cmp %[max], %[i0];"
        "jb start;"
        : [i0] "+r" (i0),
          [i1] "+r" (i1),
          [i2] "+r" (i2),
          [i3] "+r" (i3)
        : [max] "r" (max)
        :
    );
#endif
    return i0 + i1 + i2 + i3;
}
