#include <iostream>

void my_func_2(void) {}

void my_func_1(double f) {
    my_func_2();
}

void my_func_1(int i) {
    my_func_2();
}

int main(int argc, char **argv) {
    long long unsigned int n;
    if (argc > 1) {
        n = strtoul(argv[1], NULL, 0);
    } else {
        n = 1;
    }
    for (long long unsigned int i = 0; i < n; ++i) {
        my_func_1(1);   // line 21
        my_func_1(2.0); // line 22
    }
}
