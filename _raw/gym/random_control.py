#!/usr/bin/env python

import sys

import gymnasium as gym

if len(sys.argv) > 1:
    env = sys.argv[1]
else:
    env = 'LunarLander-v3'
if len(sys.argv) > 2:
    seed = int(sys.argv[2])
else:
    seed = 0
env = gym.make(env, render_mode="human")
observation, info = env.reset(seed=seed)
reward = 0
for _ in range(1000):
    action = env.action_space.sample()
    observation, reward, terminated, truncated, info = env.step(action)
    reward += reward
    if terminated or truncated:
        break
print(f'{reward=}')
env.close()
