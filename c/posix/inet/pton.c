/* https://cirosantilli.com/c-posix-library */

#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    struct in_addr addr;
    int s;

    if (argc != 2) {
        exit(EXIT_FAILURE);
    }
    s = inet_pton(AF_INET, argv[1], &addr);
    if (s <= 0) {
        if (s == 0)
            fprintf(stderr, "Not in presentation format");
        else
            perror("inet_pton");
        exit(EXIT_FAILURE);
    }
    printf("0x%08x\n", ntohl(addr.s_addr));
    exit(EXIT_SUCCESS);
}
