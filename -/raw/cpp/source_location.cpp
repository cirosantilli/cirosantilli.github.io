#include <iostream>
#include <string_view>
#include <source_location>

void log(std::string_view message,
         const std::source_location& location = std::source_location::current()
) {
    std::cout << "info:"
              << location.file_name() << ":"
              << location.line() << ":"
              << location.function_name() << " "
              << message << '\n';
}

int f(int i) {
    log("Hello world!"); // Line 16
    return i + 1;
}

int f(double i) {
    log("Hello world!"); // Line 21
    return i + 1.0;
}

int main() {
    f(1);
    f(1.0);
}
