#include <execinfo.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

#define TRACE_MAX 1024

void handler(int sig) {
    (void)sig;
    void *array[TRACE_MAX];
    size_t size;
    const char msg[] = "failed with a signal\n";

    size = backtrace(array, TRACE_MAX);
    ssize_t ret = write(STDOUT_FILENO, msg, sizeof(msg));
    (void)ret;
    backtrace_symbols_fd(array, size, STDERR_FILENO);
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
    /* Make a dummy call to `backtrace` to load libgcc because man backrace says:
     *    *  backtrace() and backtrace_symbols_fd() don't call malloc() explicitly, but they are part of libgcc, which gets loaded dynamically when first used.  Dynamic loading usually triggers a call to mal‐
     *       loc(3).  If you need certain calls to these two functions to not allocate memory (in signal handlers, for example), you need to make sure libgcc is loaded beforehand.
     */
    void *dummy[1];
    backtrace(dummy, 1);
    signal(SIGSEGV, handler);

    my_func_1(1);
}
