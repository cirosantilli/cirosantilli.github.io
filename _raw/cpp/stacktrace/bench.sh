#!/usr/bin/env bash
for b in stacktrace; do
  gcc -I "$b" -o "${b}.out" main.cpp
done
