#include <cassert>
#include <iostream>

#include "Vnegator.h"
#include "verilated.h"

#include "common.hpp"

class NegatorTestCase : public TestCase<Vnegator> {
    public:
        NegatorTestCase() : TestCase("negator.cpp.vcd") {}
        virtual void step(bool& finish) {
            this->dut->in = this->clock;
            finish = (time == 7);
        }
};

int main(int argc, char **argv) {
    Verilated::commandArgs(argc, argv);

    /*
    Sample fully explicit test case.

    Since this is a sequential circuit, we only need to test
    each input once, history does not matter.
    */
    {
        Vnegator *dut = new Vnegator;

        dut->in = 0;
        dut->eval();
        assert(dut->out == 1);

        dut->in = 1;
        dut->eval();
        assert(dut->out == 0);

        delete dut;
    }

    /* Factored out test case using our little library. */
    assert(NegatorTestCase().run());
}
