#!/usr/bin/env bash
# output: 0180020a
sqlite3 :memory: '.load ./ip' "SELECT printf('%08x', str2ipv4('1.128.2.10'))"
# output: 1.128.2.10
sqlite3 :memory: '.load ./ip' "SELECT ipv42str(0x0180020a)"
