#include <iostream>
#include <chrono>

static const double FPS_GRANULARITY_S = 0.5;
static std::chrono::high_resolution_clock::time_point fps_last_time;
static unsigned int fps_nframes;

static void fps_init() {
    fps_nframes = 0;
    fps_last_time = std::chrono::high_resolution_clock::now();
}

static void fps_update_and_print() {
    std::chrono::high_resolution_clock::time_point current_time;
    double fps_dt;
    current_time = std::chrono::high_resolution_clock::now();
    fps_nframes++;
    fps_dt = std::chrono::duration_cast<std::chrono::nanoseconds>(current_time - fps_last_time).count() * 1e-9;
    if (fps_dt > FPS_GRANULARITY_S) {
        std::cout << "FPS = " << fps_nframes / fps_dt << std::endl;
        fps_last_time = current_time;
        fps_nframes = 0;
    }
}
