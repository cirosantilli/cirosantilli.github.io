CXX = g++
CFLGS_COMMON_NOINC = -O0 -ggdb3 -Wall -Wextra -pedantic
CFLGS_COMMON = $(CFLGS_COMMON_NOINC) -DINC='"$(basename $@).h"'

.PHONY: bench_cpp20_stacktrace

cpp20_stacktrace.out: main.cpp
	${CXX} ${CFLGS_COMMON} -std=c++23 -o '$@' '$<' -lstdc++_libbacktrace

bench_cpp20_stacktrace: cpp20_stacktrace.out
	time ./'$<' 100000 \&>/dev/null

glibc_backtrace_symbols_fd.out: main.cpp
	${CXX} ${CFLGS_COMMON} -rdynamic -std=c++11 -o '$@' '$<'

glibc_backtrace_symbols_fd_no_rdynamic.out: main.cpp
	${CXX} ${CFLGS_COMMON_NOINC} -std=c++11 -DINC='"glibc_backtrace_symbols_fd.h"' -o '$@' '$<'

bench_glibc_backtrace_symbols_fd: glibc_backtrace_symbols_fd.out
	time ./'$<' 100000 \&>/dev/null

glibc_backtrace_symbols.out: main.cpp
	${CXX} ${CFLGS_COMMON} -rdynamic -std=c++11 -o '$@' '$<'

bench_glibc_backtrace_symbols: glibc_backtrace_symbols.out
	./'$<' 100000 \&>/dev/null

gdb.out: main.cpp
	${CXX} ${CFLGS_COMMON} -rdynamic -std=c++11 I -o '$@' '$<'

bench_gdb_script: gdb.out
	time gdb -nh -batch -x main.gdb --args '$<' 1000 \&>/dev/null

boost_stacktrace.out: main.cpp
	${CXX} ${CFLGS_COMMON} -std=c++11 -o '$@' '$<' -lboost_stacktrace_backtrace

bench_boost_stacktrace: boost_stacktrace.out
	time ./'$<' 100000 \&>/dev/null

boost_stacktrace_header_only.out: main.cpp
	${CXX} ${CFLGS_COMMON} -std=c++11 -o '$@' '$<'

bench_boost_stacktrace_header_only: boost_stacktrace_header_only.out
	time ./'$<' 100000 \&>/dev/null

boost_stacktrace_safe.out: main.cpp
	${CXX} ${CFLGS_COMMON} -std=c++11 -o '$@' '$<' -lstdc++fs -lboost_stacktrace_backtrace -ldl -lbacktrace

bench_boost_stacktrace_safe: boost_stacktrace_safe.out
	time ./'$<' 10000 \&>/dev/null
