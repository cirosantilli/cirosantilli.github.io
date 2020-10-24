COMMON = common.py
IN_EXT = .py
OUT_EXT = .svg

.PHONY: all clean

OUTS = $(patsubst %$(IN_EXT), %$(OUT_EXT), $(filter-out $(COMMON), $(wildcard *$(IN_EXT))))

all: $(OUTS)

%$(OUT_EXT): %$(IN_EXT) $(COMMON)
	./$(COMMON) $< $(FLAGS)

clean:
	rm -f *'$(OUT_EXT)'
