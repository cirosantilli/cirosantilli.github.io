#!/usr/bin/env bash
  grep -Eh '^[^ ]+\.[^ ]+<br>$' "$@" | sed 's/<br>$//' | sort -o "$outd/$d"
