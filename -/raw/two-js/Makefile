.POSIX:

COMMON = common.js
IN_EXT = .js
OUT_EXT = .svg

OUTS = $(addsuffix $(OUT_EXT), $(basename $(filter-out $(COMMON), $(wildcard *$(IN_EXT)))))

.PHONY: all clean

all: $(OUTS)

%$(OUT_EXT): %$(IN_EXT) $(COMMON)
	./'$<'

clean:
	rm -f *'$(OUT_EXT)'
