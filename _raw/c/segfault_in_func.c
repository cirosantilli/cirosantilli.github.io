#include <stdlib.h>
#include <stdio.h>

int f(int i) {
    *(int *)0 = 1;
    return i + 1;
}

int main(int argc, char **argv) {
    (void)argv;
    printf("%d\n", f(argc + 1));
    return EXIT_SUCCESS;
}
