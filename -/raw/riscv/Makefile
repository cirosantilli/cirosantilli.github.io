timer.elf: timer.o
	riscv64-unknown-elf-ld -Tvirt.ld timer.o -o "$@"

timer.o: timer.S
	riscv64-unknown-elf-as "$<" -o "$@"
