#include <execinfo.h> /* backtrace, backtrace_symbols */
#include <stdio.h> /* printf */

void print_stacktrace(void) {
    char **strings;
    size_t i, size;
    enum Constexpr { MAX_SIZE = 1024 };
    void *array[MAX_SIZE];
    size = backtrace(array, MAX_SIZE);
    strings = backtrace_symbols(array, size);
    for (i = 0; i < size; i++)
        printf("%s\n", strings[i]);
    free(strings);
}
