/* https://cirosantilli.com/c-posix-library */

#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    char str[INET6_ADDRSTRLEN];
    struct in_addr addr;

    if (argc != 2) {
        exit(EXIT_FAILURE);
    }
    addr.s_addr = ntohl(strtoul(argv[1], NULL, 0));
    printf("%s\n", inet_ntop(AF_INET, &addr, str, INET6_ADDRSTRLEN));
}
