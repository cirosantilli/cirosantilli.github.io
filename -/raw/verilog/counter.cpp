/* https://cirosantilli.com/verilog */

#include <cassert>
#include <iostream>

#include "Vcounter.h"
#include "verilated.h"

#include "common.hpp"

#define BITS 2
#define NVALS (1 << BITS)

class CounterTestCase : public TestCase<Vcounter> {
    public:
        CounterTestCase() : TestCase("counter.cpp.vcd") {}
        virtual bool check() {
            if (this->time < 2) {
                return true;
            } else {
                return (this->dut->out == (((this->time - 1) / 2)) % NVALS);
            }
        }
        virtual void step(bool& finish) {
            if (this->time == 0) {
                this->dut->enable = 1;
                this->dut->reset = 1;
            } else if (this->time == 2) {
                this->dut->reset = 0;
            }
            this->dut->clock = this->clock;
            finish = (time == 10);
        }
};

int main(int argc, char **argv) {
    Verilated::commandArgs(argc, argv);

    /* Simple test. */
    {
        Vcounter *dut = new Vcounter;
        dut->enable = 1;

        dut->reset = 1;
        dut->clock = 0;
        dut->eval();
        dut->clock = 1;
        dut->eval();
        assert(dut->out == 0);

        dut->reset = 0;

        dut->clock = 0;
        dut->eval();
        dut->clock = 1;
        dut->eval();
        assert(dut->out == 1);

        dut->clock = 0;
        dut->eval();
        dut->clock = 1;
        dut->eval();
        assert(dut->out == 2);

        dut->final();
        delete dut;
    }

    assert(CounterTestCase().run());
}
