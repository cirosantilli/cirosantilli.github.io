#define _XOPEN_SOURCE 700
#include <signal.h> /* signal, SIGSEGV */

#include <unistd.h> /* write, STDOUT_FILENO */

void signal_handler(int sig) {
    (void)sig;
    const char msg[] = "signal received\n";
    write(STDOUT_FILENO, msg, sizeof(msg));
}

int myfunc(int i) {
    *(int *)0 = 1;
    return i + 1;
}

int main(int argc, char **argv) {
    (void)argv;
    /* Adapted from: https://www.gnu.org/software/libc/manual/html_node/Sigaction-Function-Example.html */
    struct sigaction new_action;
    new_action.sa_handler = signal_handler;
    sigemptyset(&new_action.sa_mask);
    new_action.sa_flags = SA_NODEFER|SA_RESETHAND;
    sigaction(SIGINT, &new_action, NULL);
    int ret = myfunc(argc);
    return ret;
}

