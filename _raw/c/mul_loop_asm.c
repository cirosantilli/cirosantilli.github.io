#include <stdlib.h>
#include <stdint.h>

int main(int argc, char **argv) {
    uint64_t max, i, x0;
    if (argc > 1) {
        max = strtoll(argv[1], NULL, 0);
    } else {
        max = 1;
    }
    i = max;
    x0 = 1;
#if defined(__x86_64__) || defined(__i386__)
    __asm__ (
        "mov %[x0], %%rax;"
        "mov $2, %%rbx;"
        ".align 64;"
        "loop:"
        "mul %%rbx;"
        "dec %[i];"
        "jne loop;"
        "mov %%rax, %[x0];"
        : [i] "+r" (i),
          [x0] "+r" (x0)
        :
        : "rax",
          "rbx",
          "rdx"
    );
#endif
    return x0;
}
