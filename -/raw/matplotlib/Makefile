COMMON = common.py
IN_EXT = .py
OUT_EXT_PNG = png
OUT_EXT_SVG = svg

.PHONY: all clean

INS = $(filter-out $(COMMON), $(wildcard *$(IN_EXT)))
OUTS_PNG = $(patsubst %$(IN_EXT), %.$(OUT_EXT_PNG), $(INS))
OUTS_SVG = $(patsubst %$(IN_EXT), %.$(OUT_EXT_SVG), $(INS))

default: $(OUTS_SVG)

png: $(OUTS_PNG)

%.$(OUT_EXT_PNG): %$(IN_EXT) $(COMMON)
	./$(COMMON) '$<' '$(OUT_EXT_PNG)'

%.$(OUT_EXT_SVG): %$(IN_EXT) $(COMMON)
	./$(COMMON) '$<' '$(OUT_EXT_SVG)'

clean:
	rm -f *.'$(OUT_EXT_PNG)' *.'$(OUT_EXT_SVG)'
