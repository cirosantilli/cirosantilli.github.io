.POSIX:

.PHONY: all clean run

RUN ?= move
OUT_EXT ?= .out
VERILATOR_DIR = ./obj_dir/

all: $(VERILATOR_DIR)Vand2 $(VERILATOR_DIR)Vmove display$(OUT_EXT)

$(VERILATOR_DIR)Vand2: and2.v and2.cpp fps.hpp
	verilator -Wall --cc and2.v --exe and2.cpp
	make -C obj_dir -f Vand2.mk Vand2 LIBS='-lSDL2'

$(VERILATOR_DIR)Vmove: move.v move.cpp fps.hpp
	verilator -Wall --cc move.v --exe move.cpp
	make -C obj_dir -f Vmove.mk Vmove CXXFLAGS='--std=c++11 -Wall' LIBS='-lSDL2'

display$(OUT_EXT): display.cpp
	g++ -o '$@' '$<' -lm -lSDL2

clean:
	rm -rf obj_dir *'$(OUT_EXT)'

run: all
	'$(VERILATOR_DIR)V$(RUN)'
