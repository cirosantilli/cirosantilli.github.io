#!/usr/bin/env python

import sys

import gymnasium as gym
from gymnasium.utils.play import play

if len(sys.argv) > 1:
    seed = int(sys.argv[1])
else:
    seed = 0
reward = 0
def myfunc(
    obs_t,
    obs_tp1,
    action,
    rew,
    terminated,
    truncated,
    info,
):
    global reward
    reward += rew
    if terminated or truncated:
        print(f'reward={float(reward)}')
        reward = 0

play(gym.make("LunarLander-v3", render_mode="rgb_array"),  
    keys_to_action={    
        "w": 2,
        "a": 3,
        "d": 1,
    },
    callback=myfunc,
    fps=10,
    noop=0,
    seed=seed,
)
