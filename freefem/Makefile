.POSIX:

DATA_EXT ?= $(IN_EXT).dat
IN_EXT ?= .freefem
OUT_EXT ?= .gif
PLOT_EXT ?= .gnuplot

OUTS := $(addsuffix $(OUT_EXT), $(basename $(wildcard *$(IN_EXT))))

.PHONY: all clean

all: $(OUTS)

%$(OUT_EXT): %$(PLOT_EXT) %$(DATA_EXT)
	./'$<'

%$(DATA_EXT): %$(IN_EXT)
	PATH="$${PATH}:$${CIROSANTILLI_FREEFEM_BIN_DIR}" FreeFem++ '$<'

clean:
	rm -f *'$(DATA_EXT)' *'$(OUT_EXT)'
