#include <iostream>

#define BOOST_STACKTRACE_LINK
#include <boost/stacktrace.hpp>

void print_stacktrace(void) {
    std::cout << boost::stacktrace::stacktrace();
}
