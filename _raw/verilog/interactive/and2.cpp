const char *help = "hold 'a' and 'b' at the same time -> the screen turns red";

#include <cstdlib>

#include "Vand2.h"
#include "verilated.h"

#include <SDL2/SDL.h>

#define WINDOW_WIDTH 512
#define WINDOW_HEIGHT (WINDOW_WIDTH)

int main(int argc, char **argv, char **env) {
    SDL_Event event;
    SDL_Rect rect;
    SDL_Renderer *renderer;
    SDL_Window *window;
    int a_pressed, b_pressed;
    int quit;

    quit = 0;
    a_pressed = 0;
    b_pressed = 0;

    Verilated::commandArgs(argc, argv);
    Vand2 *top = new Vand2;

    SDL_Init(SDL_INIT_TIMER | SDL_INIT_VIDEO);
    SDL_CreateWindowAndRenderer(WINDOW_WIDTH, WINDOW_WIDTH, 0, &window, &renderer);
    SDL_SetWindowTitle(window, help);
    rect.x = 0;
    rect.y = 0;
    rect.w = WINDOW_WIDTH;
    rect.h = WINDOW_HEIGHT;

    while (!quit) {
        while (SDL_PollEvent(&event) == 1) {
            if (event.type == SDL_QUIT) {
                quit = 1;
            } else if (event.type == SDL_KEYDOWN) {
                switch(event.key.keysym.sym) {
                    case SDLK_a:
                        a_pressed = 1;
                        break;
                    case SDLK_b:
                        b_pressed = 1;
                        break;
                    default:
                        break;
                }
            } else if (event.type == SDL_KEYUP) {
                switch(event.key.keysym.sym) {
                    case SDLK_a:
                        a_pressed = 0;
                        break;
                    case SDLK_b:
                        b_pressed = 0;
                        break;
                    default:
                        break;
                }
            }
        }

        top->in1 = a_pressed;
        top->in2 = b_pressed;
        top->eval();

        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 0);
        SDL_RenderClear(renderer);
        SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
        if (top->out == 1)
            SDL_RenderFillRect(renderer, &rect);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    top->final();
    delete top;

    return EXIT_SUCCESS;
}
