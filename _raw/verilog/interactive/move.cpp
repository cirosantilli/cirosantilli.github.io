const char *help = "asdw: move | q: quit";

#include <cmath>
#include <cstdlib>
#include <time.h>

#include <SDL2/SDL.h>

#include "Vmove.h"
#include "verilated.h"

#include "fps.hpp"

#define WINDOW_WIDTH 512
#define RECTS_PER_WINDOW (4)
#define RECT_WIDTH (WINDOW_WIDTH / RECTS_PER_WINDOW)
#define FASTEST_TICK_PERIOD_S (1.0 / 4.0)

int main(int argc, char **argv) {
    SDL_Event event;
    SDL_Renderer *renderer;
    SDL_Window *window;
    double current_time_s, last_tick_time_s;
    unsigned int current_time, last_time;
    const Uint8 *keystate;

    Verilated::commandArgs(argc, argv);
    Vmove *top = new Vmove;

    SDL_Init(SDL_INIT_TIMER | SDL_INIT_VIDEO);
    SDL_CreateWindowAndRenderer(WINDOW_WIDTH, WINDOW_WIDTH, 0, &window, &renderer);
    SDL_SetWindowTitle(window, help);

    fps_init();
    top->clock = 0;
    top->eval();
    top->reset = 1;
    top->clock = 1;
    top->eval();
    while (1) {
        current_time = SDL_GetTicks();
        current_time_s = current_time / 1000.0;

        /* Deal with keyboard input. */
        while (SDL_PollEvent(&event) == 1) {
            if (event.type == SDL_QUIT) {
                goto quit;
            } else if (event.type == SDL_KEYDOWN) {
                switch(event.key.keysym.sym) {
                    case SDLK_q:
                        goto quit;
                    default:
                        break;
                }
            }
        }
        keystate = SDL_GetKeyboardState(NULL);

        if (keystate[SDL_SCANCODE_ESCAPE]) {
            top->reset = 1;
        }
        if (keystate[SDL_SCANCODE_A]) {
            top->left = 1;
        }
        if (keystate[SDL_SCANCODE_D]) {
            top->right = 1;
        }
        if (keystate[SDL_SCANCODE_W]) {
            top->up = 1;
        }
        if (keystate[SDL_SCANCODE_S]) {
            top->down = 1;
        }

        if (current_time != last_time) {
            if (current_time_s - last_tick_time_s > FASTEST_TICK_PERIOD_S) {
                /* Draw world. */
                SDL_SetRenderDrawColor(renderer, 0, 0, 0, 0);
                SDL_RenderClear(renderer);

                {
                    SDL_Rect rect;
                    rect.w = RECT_WIDTH;
                    rect.h = RECT_WIDTH;
                    rect.x = top->x * RECT_WIDTH;
                    rect.y = top->y * RECT_WIDTH;
                    SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
                    SDL_RenderFillRect(renderer, &rect);
                }

                SDL_RenderPresent(renderer);

                top->clock = 0;
                top->eval();
                top->clock = 1;
                top->eval();

                top->up = 0;
                top->down = 0;
                top->left = 0;
                top->right = 0;
                top->reset = 0;

                /* Update time tracking. */
                last_tick_time_s = current_time_s;
                fps_update_and_print();
            }
        }
        last_time = current_time;
    }
quit:
    top->final();
    delete top;

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return EXIT_SUCCESS;
}
