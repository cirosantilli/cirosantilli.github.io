#include <execinfo.h> /* backtrace, backtrace_symbols_fd */
#include <unistd.h> /* STDOUT_FILENO */

void print_stacktrace(void) {
    size_t size;
    enum Constexpr { MAX_SIZE = 1024 };
    void *array[MAX_SIZE];
    size = backtrace(array, MAX_SIZE);
    backtrace_symbols_fd(array, size, STDOUT_FILENO);
}
