.POSIX:

# Input parameters
CC = gcc
CFLGS = -shared -fPIC -ggdb3 -O0 -pedantic-errors -std=c99 -Wall -Wextra
IN_EXT = .c
OUT_DIR = .
OUT_EXT = .so

OUTS = $(addprefix $(OUT_DIR)/, $(addsuffix $(OUT_EXT), $(basename $(wildcard *$(IN_EXT)))))

.PHONY: all clean mkdir

all: mkdir $(OUTS)

$(OUT_DIR)/%$(OUT_EXT): %$(IN_EXT)
	$(CC) $(CFLGS) -o '$@' '$<'

clean:
	if [ '$(OUT_DIR)' = '.' ]; then \
	  rm -f *'$(OUT_EXT)'; \
	else \
	  rm -rf '$(OUT_DIR)'; \
	fi

mkdir:
	mkdir -p '$(OUT_DIR)'
