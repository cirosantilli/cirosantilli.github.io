#include <iostream>
#include <stacktrace>

void print_stacktrace() {
    std::cout << std::stacktrace::current();
}
