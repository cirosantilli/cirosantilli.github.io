#include <bitset>
#include <cassert>
#include <cstdint>
#include <fstream>
#include <iostream>

#include "Vsubleq.h"
#include "verilated.h"

#include "common.hpp"

template<
    typename ADDRESS_TYPE,
    unsigned int ADDRESS_BITS,
    typename DATA_TYPE,
    unsigned int DATA_BITS,
    unsigned int NWORDS = (1 << ADDRESS_BITS),
    unsigned int NBITS = (NWORDS * DATA_BITS)
>
class Ram : public std::bitset<NBITS> {
    private:

        /* http://stackoverflow.com/questions/17857596/how-to-convert-a-range-subset-of-bits-in-a-c-bitset-to-a-number
         * http://stackoverflow.com/questions/2177186/in-bitset-can-i-use-to-ulong-for-a-specific-range-of-bits */
        DATA_TYPE get_word(ADDRESS_TYPE address) {
            DATA_TYPE ret = 0;
            DATA_TYPE mask = 1;
            auto base = address * DATA_BITS;
            for (std::size_t i = 0; i < DATA_BITS; ++i) {
                if (this->operator[](base + i))
                    ret |= mask;
                mask <<= 1;
            }
            return ret;
        }

        void set_word(ADDRESS_TYPE address, DATA_TYPE data) {
            DATA_TYPE ret = 0;
            DATA_TYPE mask = 1;
            auto base = address * DATA_BITS;
            for (std::size_t i = 0; i < DATA_BITS; ++i) {
                this->set(address + i, mask & data);
                mask <<= 1;
            }
        }

        void load(const char *buffer) {
            DATA_TYPE mask = 1;
            for (size_t bit = 0; bit < NBITS; ++bit) {
                this->set(bit, buffer[bit >> 3] & (1 << (bit % 8)));
            }
        }

    public:

        using std::bitset<NBITS>::bitset;

        void update(
            ADDRESS_TYPE &address,
            DATA_TYPE &data,
            bool write
        ) {
            if (write) {
                this->set_word(address, data);
            } else {
                data = this->get_word(address);
            }
            //std::cout
                //<< " " << unsigned(address)
                //<< " " << unsigned(data)
                //<< " " << unsigned(write)
                //<< std::endl
            //;
        }

        static constexpr decltype(ADDRESS_BITS) get_nbits() { return NBITS; }
};

template<unsigned int BITS>
class SubleqTestCase : public TestCase<Vsubleq> {
    public:
        typedef Ram<decltype(Vsubleq::address), BITS, decltype(Vsubleq::data), BITS> ram_t;
        SubleqTestCase(
            ram_t &ram,
            std::string vcd_file_path
        ) :
            TestCase(vcd_file_path),
            ram(ram)
        {}
        virtual bool check() {
            return true;
        }
        virtual void step(bool& finish) {
            if (this->time == 0) {
                this->dut->reset = 1;
            } else if (this->time == 2) {
                this->dut->reset = 0;
            }
            ram.update(
                this->dut->address,
                this->dut->data,
                this->dut->write
            );
            this->dut->clock = this->clock;
            if (this->dut->halt || this->time == 64) {
                finish = true;
            }
        }
        static constexpr decltype(ram_t::get_nbits()) get_nbits() {
            return ram_t::get_nbits();
        }
    private:
        ram_t &ram;
};

int main(int argc, char **argv) {
    Verilated::commandArgs(argc, argv);
    constexpr unsigned int BITS = 4;

    // Zero input. Immediate infinite loop.
    {
        SubleqTestCase<BITS>::ram_t ram0, ram;
        assert(SubleqTestCase<BITS>(ram, "subleq_zero.cpp.vcd").run());
        assert(ram == ram0);
    }

    // 2 state oscillator. Never halts, but never does anything either.
    {
        SubleqTestCase<BITS>::ram_t ram0(
            "0000" "0000" "0000"
            "0011" "0000" "0000"
            //"0101" "0100" "0011"
            //"0010" "0001" "0000"
            //"1111" "1111" "1111"
            //"1111" "1111" "1111"
        );
        auto ram = ram0;
        assert(SubleqTestCase<BITS>(ram, "subleq_oscillator.cpp.vcd").run());
        assert(ram == ram0);
    }

    //assert(SubleqTestCase<BITS>(buffer, "subleq_inc.cpp.vcd").run());
}
