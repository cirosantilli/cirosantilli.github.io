#include <stdlib.h>
#include <stdint.h>

int main(int argc, char **argv) {
    uint64_t max, i;
    if (argc > 1) {
        max = strtoll(argv[1], NULL, 0);
    } else {
        max = 1;
    }
    i = max;
#if defined(__x86_64__) || defined(__i386__)
    __asm__ (
        "loop:"
        "dec %[i];"
        "jne loop;"
        : [i] "+r" (i)
        :
        :
    );
#endif
    return i;
}
