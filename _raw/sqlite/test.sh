#!/usr/bin/env bash
# output: 0180020a
sqlite3 :memory: '.load ./ip' "SELECT printf('%08x', ips2i('1.128.2.10'))"
# output: 1.128.2.10
sqlite3 :memory: '.load ./ip' "SELECT ipi2s(0x0180020a)"
