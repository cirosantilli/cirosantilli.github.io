#include <stdlib.h>
#include <stdint.h>

int main(int argc, char **argv) {
    uint64_t max, i, x0, x1;
    if (argc > 1) {
        max = strtoll(argv[1], NULL, 0);
    } else {
        max = 1;
    }
    i = 0;
    x0 = 1;
    x1 = 1;
#if defined(__x86_64__) || defined(__i386__)
    __asm__ (
        "mov $2, %%rbx;"
        "loop:"

        "mov %[x0], %%rax;"
        "mul %%rbx;"
        "mov %%rax, %[x0];"

        "mov %[x1], %%rax;"
        "mul %%rbx;"
        "mov %%rax, %[x1];"

        "inc %[i];"
        "cmp %[max], %[i];"
        "jb loop;"
        : [i] "+r" (i),
          [x0] "+r" (x0),
          [x1] "+r" (x1)
        : [max] "r" (max)
        : "rax",
          "rbx" ,
          "rdx" 
    );
#endif
    return x0 + x1;
}
