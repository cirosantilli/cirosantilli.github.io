#include <cassert>
#include <iostream>
#include <memory>
#include <sstream>
#include <string>

#include <cxxabi.h> // __cxa_demangle
#include <elfutils/libdwfl.h> // Dwfl*
#include <execinfo.h> // backtrace
#include <unistd.h> // getpid

// https://stackoverflow.com/questions/281818/unmangling-the-result-of-stdtype-infoname
std::string demangle(const char* name) {
    int status = -4;
    std::unique_ptr<char, void(*)(void*)> res {
        abi::__cxa_demangle(name, NULL, NULL, &status),
        std::free
    };
    return (status==0) ? res.get() : name ;
}

std::string debug_info(Dwfl* dwfl, void* ip) {
    std::string function;
    int line = -1;
    char const* file;
    uintptr_t ip2 = reinterpret_cast<uintptr_t>(ip);
    Dwfl_Module* module = dwfl_addrmodule(dwfl, ip2);
    char const* name = dwfl_module_addrname(module, ip2);
    function = name ? demangle(name) : "<unknown>";
    if (Dwfl_Line* dwfl_line = dwfl_module_getsrc(module, ip2)) {
        Dwarf_Addr addr;
        file = dwfl_lineinfo(dwfl_line, &addr, &line, nullptr, nullptr, nullptr);
    }
    std::stringstream ss;
    ss << ip << ' ' << function;
    if (file)
        ss << " at " << file << ':' << line;
    ss << std::endl;
    return ss.str();
}

std::string stacktrace() {
    // Initialize Dwfl.
    Dwfl* dwfl = nullptr;
    {
        Dwfl_Callbacks callbacks = {};
        char* debuginfo_path = nullptr;
        callbacks.find_elf = dwfl_linux_proc_find_elf;
        callbacks.find_debuginfo = dwfl_standard_find_debuginfo;
        callbacks.debuginfo_path = &debuginfo_path;
        dwfl = dwfl_begin(&callbacks);
        assert(dwfl);
        int r;
        r = dwfl_linux_proc_report(dwfl, getpid());
        assert(!r);
        r = dwfl_report_end(dwfl, nullptr, nullptr);
        assert(!r);
        static_cast<void>(r);
    }

    // Loop over stack frames.
    std::stringstream ss;
    {
        void* stack[512];
        int stack_size = ::backtrace(stack, sizeof stack / sizeof *stack);
        for (int i = 0; i < stack_size; ++i) {
            ss << i << ": ";

            // Works.
            ss << debug_info(dwfl, stack[i]);

#if 0
            // TODO intended to do the same as above, but segfaults,
            // so possibly UB In above function that does not blow up by chance?
            void *ip = stack[i];
            std::string function;
            int line = -1;
            char const* file;
            uintptr_t ip2 = reinterpret_cast<uintptr_t>(ip);
            Dwfl_Module* module = dwfl_addrmodule(dwfl, ip2);
            char const* name = dwfl_module_addrname(module, ip2);
            function = name ? demangle(name) : "<unknown>";
            // TODO if I comment out this line it does not blow up anymore.
            if (Dwfl_Line* dwfl_line = dwfl_module_getsrc(module, ip2)) {
              Dwarf_Addr addr;
              file = dwfl_lineinfo(dwfl_line, &addr, &line, nullptr, nullptr, nullptr);
            }
            ss << ip << ' ' << function;
            if (file)
                ss << " at " << file << ':' << line;
            ss << std::endl;
#endif
        }
    }
    dwfl_end(dwfl);
    return ss.str();
}

void my_func_2() {
    std::cout << stacktrace() << std::endl;
    std::cout.flush();
}

void my_func_1(double f) {
    (void)f;
    my_func_2();
}

void my_func_1(int i) {
    (void)i;
    my_func_2();
}

int main(int argc, char **argv) {
    long long unsigned int n;
    if (argc > 1) {
        n = strtoul(argv[1], NULL, 0);
    } else {
        n = 1;
    }
    for (long long unsigned int i = 0; i < n; ++i) {
        my_func_1(1);   // line 122
        my_func_1(2.0); // line 123
    }
}
