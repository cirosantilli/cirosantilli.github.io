#ifndef COMMON_H
#define COMMON_H

#include <cstdint>
#include <string>

#include "verilated_vcd_c.h"

template<class Vdut>
class TestCase {
    protected:
        Vdut *dut;
        std::string vcdPath;
        uint64_t clock;
        uint64_t time;
    public:
        TestCase(std::string vcdPath) {
            this->dut = new Vdut;
            this->vcdPath = vcdPath;
            this->clock = 0;
            this->time = 0;
        }
        ~TestCase() {
            this->dut->final();
            delete this->dut;
        }
        virtual bool check() { return true; }
        virtual void step(bool& finish) = 0;
        bool run() {
            bool finish, pass;
            Verilated::traceEverOn(true);
            VerilatedVcdC *vcd = new VerilatedVcdC;
            this->dut->trace(vcd, 99);
            vcd->open(vcdPath.c_str());
            pass = true;
            do {
                this->step(finish);
                this->dut->eval();
                vcd->dump(this->time);
                pass = this->check();
                this->time++;
                this->clock = !this->clock;
                if (!pass || Verilated::gotFinish()) {
                    finish = true;
                }
            } while(!finish);
            vcd->dump(this->time);
            vcd->close();
            delete vcd;
            return pass;
        }
};

#endif
