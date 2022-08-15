.POSIX:

-include params.makefile

VERILATOR_IN_EXT ?= .cpp
VERILATOR_OUT_DIR ?= obj_dir/
VERILATOR_OUTS := $(addprefix $(VERILATOR_OUT_DIR)V, $(basename $(wildcard *$(VERILATOR_IN_EXT))))

.PHONY: all all-verilator clean run run-verilator

all: $(VERILATOR_OUTS)

# -f is mainly for -G parameters, which must be known at compile time and cannot be set from C:
# https://www.veripool.org/boards/2/topics/276-Verilator-Efficient-Usage-of-Verilog-Parameters
$(VERILATOR_OUT_DIR)V%: %$(VERILATOR_IN_EXT) %.v
	verilator -CFLAGS "-ggdb3 --std=c++11" --cc '$(basename $<)'.v --exe -f $(basename $<).params --trace '$<'
	make -C '$(VERILATOR_OUT_DIR)' -f V$(basename $<).mk -j"$$(($$(nproc) - 2))" V$(basename $<)

clean:
	git clean -Xdf .

run: run-verilator

run-verilator: $(VERILATOR_OUTS)
	./run-many run-verilator-one $^

run-verilator-%: $(VERILATOR_OUT_DIR)V%
	./run-verilator-one '$<'
