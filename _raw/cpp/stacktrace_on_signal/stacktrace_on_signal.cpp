#include <stacktrace>
#include <iostream>

#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void handler(int sig) {
    (void)sig;
    /* De-register this signal in the hope of avoiding infinite loops
     * if asyns signal unsafe things fail later on. Not sure it actually works. */
    signal(sig, SIG_DFL);
    std::cout << std::stacktrace::current();
    // C99 async signal safe version of exit().
    _Exit(1);
}

void my_func_2(void) {
    *((int*)0) = 1;
}

void my_func_1(double f) {
    (void)f;
    my_func_2();
}

void my_func_1(int i) {
    (void)i;
    my_func_2();
}

int main() {
    signal(SIGSEGV, handler);
    my_func_1(1);
}
