.POSIX:

IN_EXT = .dot
OUT_EXT = .png

OUTS = $(addsuffix $(OUT_EXT), $(basename $(wildcard *$(IN_EXT))))

.PHONY: all clean

all: $(OUTS)

%$(OUT_EXT): %$(IN_EXT)
	dot -T png -o '$@' '$<'

clean:
	rm -f *'$(OUT_EXT)';
