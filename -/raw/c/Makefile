.POSIX:

# Input parameters
CC = gcc
CFLGS = -ggdb3 -O$O -pedantic-errors -std=c11 -Wall -Wextra
IN_EXT = .c
O = 0
OUT_DIR = .
OUT_EXT = .out

-include Makefile_params

OUTS = $(addprefix $(OUT_DIR)/, $(addsuffix $(OUT_EXT), $(basename $(wildcard *$(IN_EXT)))))

.PHONY: all clean mkdir test

all: mkdir $(OUTS)

$(OUT_DIR)/%$(OUT_EXT): %$(IN_EXT)
	$(CC) $(CFLGS) -o '$@' '$<' $(LIBS)

$(OUT_DIR)%$(OUT_EXT): $(IN_DIR)%$(CXX_EXT) $(ALL_DEPEND)
	$(CXX) $(CXXFLAGS) -o '$@' '$<' $(LIBS)

$(OUT_DIR)%$(OUT_EXT): $(IN_DIR)%$(FF_EXT) $(ALL_DEPEND)
	$(FF) $(FFLAGS) -o '$@' '$<' $(FFLIBS)

clean:
	if [ '$(OUT_DIR)' = '.' ]; then \
	  rm -f *'$(OUT_EXT)'; \
	else \
	  rm -rf '$(OUT_DIR)'; \
	fi

mkdir:
	mkdir -p '$(OUT_DIR)'

test: all
	@\
	for t in *"$(OUT_EXT)"; do\
	  if ! ./"$$t"; then\
		echo "ASSERT FAILED: $$t";\
		exit 1;\
	  fi;\
	done;\

-include Makefile_targets
