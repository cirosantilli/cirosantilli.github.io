#include <stdlib.h>
#include <stdint.h>

int main(int argc, char **argv) {
    uint64_t max, i, x0, x1;
    if (argc > 1) {
        max = strtoll(argv[1], NULL, 0);
    } else {
        max = 1;
    }
    i = max;
    x0 = 1;
    x1 = 1;
#if defined(__x86_64__) || defined(__i386__)
    __asm__ (
        "mov $2, %%rbx;"
        ".align 64;"
        "loop:"

        "mov %[x0], %%rax;"
        "mul %%rbx;"
        "mov %%rax, %[x0];"

        "mov %[x1], %%rax;"
        "mul %%rbx;"
        "mov %%rax, %[x1];"

        "dec %[i];"
        "jne loop;"
        : [i] "+r" (i),
          [x0] "+r" (x0),
          [x1] "+r" (x1)
        :
        : "rax",
          "rbx" ,
          "rdx" 
    );
#endif
    return x0 + x1;
}
