#include <iostream>

#include <boost/stacktrace.hpp>

void print_stacktrace(void) {
    std::cout << boost::stacktrace::stacktrace();
}
