cmake_minimum_required(VERSION 3.0)
project(ProjectName)

# Option that doesn't need to be boolean:
# https://stackoverflow.com/questions/36358217/what-is-the-difference-between-option-and-set-cache-bool-for-a-cmake-variabl
set(MSG "hello" CACHE STRING "How to greet")

# Boolean only. Defaults to false.
option(WORLD "Print world or not?" ON)

# Add -D defines.
if (WORLD)
  add_compile_definitions(MYWORLD)
endif()
add_compile_definitions(MYMSG="${MSG}")

add_executable(main main.c)
