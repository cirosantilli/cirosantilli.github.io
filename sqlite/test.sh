#!/usr/bin/env bash
# output: 0180020a
sqlite3 :memory: '.load ./ip' "SELECT printf('%08x', str2ipv4('1.128.2.10'))"
