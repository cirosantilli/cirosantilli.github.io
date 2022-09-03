#include <stdio.h>
#include <stdlib.h>

int main(void) {
    puts(MYMSG);
#ifdef MYWORLD
    puts("world");
#endif
    return EXIT_SUCCESS;
}
