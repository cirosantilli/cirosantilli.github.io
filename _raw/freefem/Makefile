.POSIX:

CCC ?= gnuplot -e 'set terminal gif animate delay 10' \
  -e 'set output "$@"' \
  -e 'f = "$(patsubst %$(OUT_EXT),%$(DATA_EXT),$@)"'
DATA_EXT ?= $(IN_EXT).dat
IN_EXT ?= .freefem
OUT_EXT ?= .gif
PLOT_EXT ?= .gnuplot

BASENAMES_NOEXT = $(patsubst %$(IN_EXT), %, $(wildcard *$(IN_EXT)))
OUTS := $(addsuffix $(OUT_EXT), $(BASENAMES_NOEXT))
DATAS := $(addsuffix $(DATA_EXT), $(BASENAMES_NOEXT))

.PRECIOUS: $(DATAS)

.PHONY: all clean

all: $(OUTS)

%.1d$(OUT_EXT): 1d$(PLOT_EXT) %.1d$(DATA_EXT)
	$(CCC) '$<'

%.2d$(OUT_EXT): 2d$(PLOT_EXT) %.2d$(DATA_EXT)
	$(CCC) '$<'

%$(DATA_EXT): %$(IN_EXT)
	PATH="$${PATH}:$${CIROSANTILLI_FREEFEM_BIN_DIR}" FreeFem++ '$<'

clean:
	rm -f *'$(DATA_EXT)' *'$(OUT_EXT)'
