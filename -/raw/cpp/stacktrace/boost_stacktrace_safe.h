#include <unistd.h>

#define BOOST_STACKTRACE_LINK
#include <boost/stacktrace.hpp>

void print_stacktrace(void) {
    boost::stacktrace::safe_dump_to(0, 1024, STDOUT_FILENO);
}
