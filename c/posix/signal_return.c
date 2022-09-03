/* https://cirosantilli.com/c-posix-library */

#include <stdio.h> /* puts */
#include <stdlib.h> /* EXIT_SUCCESS */
#include <signal.h> /* signal, raise, SIGSEGV */

#include <unistd.h> /* write, STDOUT_FILENO */

void signal_handler(int sig) {
    (void)sig;
    const char msg[] = "signal received\n";
    write(STDOUT_FILENO, msg, sizeof(msg));
    /* The handler automatically disables handling of future signals.
     * So we set it again here. */
    signal(SIGSEGV, signal_handler);
}

int main(int argc, char **argv) {
    (void)argv;
    signal(SIGSEGV, signal_handler);
    if (argc > 1) {
        *(int *)0 = 1;
    } else {
        raise(SIGSEGV);
    }
    puts("after");
    return EXIT_SUCCESS;
}
