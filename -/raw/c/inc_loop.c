#include <stdlib.h>

int main(int argc, char **argv) {
    unsigned long long max;
    if (argc > 1) {
        max = strtoll(argv[1], NULL, 0);
    } else {
        max = 1;
    }
    unsigned long long ret;
    for (ret = 0; ret < max; ret++) {}
    return ret;
}
